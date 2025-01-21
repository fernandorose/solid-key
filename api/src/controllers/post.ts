import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

import pool from '@/database/connection';
import { idGen } from '@/utils/idGen';
import { JWT_SECRET_ADMIN, JWT_SECRET_USER } from '@/config/config';

const io = new Server();

interface CustomRequest extends Request {
  user?: JwtPayload & {
    role?: string;
  };
}

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const id = idGen();
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error, value } = userSchema.validate(
    { name, email, password, role },
    { abortEarly: false }
  );

  const userRole = role && ['user', 'admin'].includes(role) ? role : 'user';

  try {
    const newUser = await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, value.name, value.email, hashedPassword, userRole]
    );
    io.emit('newUser', newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while logging out.',
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const secret = user.role === 'admin' ? JWT_SECRET_ADMIN : JWT_SECRET_USER;

    const expiresIn = user.role === 'admin' ? '3h' : '1h';

    const token = jwt.sign(payload, secret as string, { expiresIn });

    const now = new Date();
    await pool.query('UPDATE users SET last_login = $1 WHERE id = $2', [
      now,
      user.id,
    ]);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: expiresIn === '3h' ? 3 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token },
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ message: 'Internal server error' });
    } else {
      return res.status(500).json({ message: (err as Error).message });
    }
  }
};

export const validateToken = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  let decoded: JwtPayload | undefined;

  try {
    decoded = jwt.verify(token, JWT_SECRET_USER as string) as JwtPayload;
  } catch (errUser) {
    try {
      decoded = jwt.verify(token, JWT_SECRET_ADMIN as string) as JwtPayload;
    } catch (errAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.',
        error: 'Token could not be verified.',
      });
      return;
    }
  }

  if (decoded) {
    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      user: decoded,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
  });
};

export const decodeToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided.' });
  }

  try {
    let decoded: JwtPayload | undefined;

    try {
      decoded = jwt.verify(token, JWT_SECRET_USER as string) as JwtPayload;
    } catch (err) {
      decoded = jwt.verify(token, JWT_SECRET_ADMIN as string) as JwtPayload;
    }

    if (decoded) {
      return res.status(200).json({
        success: true,
        message: 'Token decoded successfully.',
        data: decoded,
      });
    } else {
      throw new Error('Unable to decode token.');
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
      error: (err as Error).message,
    });
  }
};

export const createPassword = async (req: Request, res: Response) => {
  const {
    user_id,
    site_name,
    site_url,
    site_username,
    site_password,
    categories,
  } = req.body;

  const id = idGen();

  if (!user_id || !site_name || !site_url || !site_username || !site_password) {
    res.status(400).json({ message: 'All required fields must be provided.' });
  }

  const hashedPassword = await bcrypt.hash(site_password, 10);

  try {
    // Crear la contraseña en la tabla passwords
    const passwordResult = await pool.query(
      `
      INSERT INTO passwords (id, user_id, site_name, site_url, site_username, site_password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
      `,
      [id, user_id, site_name, site_url, site_username, hashedPassword]
    );

    const passwordId = passwordResult.rows[0].id;

    // Crear el mapeo con las categorías
    if (categories && categories.length > 0) {
      const mappings = categories.map((categoryId: number) => [
        idGen(), // Generar un id único para cada fila del mapeo
        passwordId,
        categoryId,
      ]);

      const mappingValues: string = mappings
        .map(
          (_: number[], i: number) =>
            `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
        )
        .join(', ');

      const mappingParams = mappings.flat();

      await pool.query(
        `
        INSERT INTO password_category_mapping (id, password_id, category_id)
        VALUES ${mappingValues};
        `,
        mappingParams
      );
    }

    io.emit('newPassword', { id, user_id, site_name, site_url, site_username });
    res
      .status(201)
      .json({ message: 'Password created successfully.', passwordId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createPasswordCategory = async (req: Request, res: Response) => {
  const { category_name, user_id } = req.body;
  const id = idGen();
  try {
    const newCategory = await pool.query(
      'INSERT INTO password_categories (id, category_name, user_id) VALUES ($1, $2, $3) RETURNING *',
      [id, category_name, user_id]
    );
    io.emit('newCategory', newCategory.rows[0]);
    res.status(201).json(newCategory.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createPasswordKey = async (req: Request, res: Response) => {
  try {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = false,
    } = req.body;

    // Validaciones
    if (length < 4 || length > 128) {
      res.status(400).json({ error: 'Length must be between 4 and 128.' });
      return;
    }

    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      res
        .status(400)
        .json({ error: 'At least one character type must be selected.' });
      return;
    }

    // Caracteres disponibles
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let characterPool = '';
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeLowercase) characterPool += lowercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    // Generación de la contraseña
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characterPool.length);
      password += characterPool[randomIndex];
    }

    // Respuesta
    res.status(200).json({ password });
  } catch (error) {
    console.error('Error generating password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
