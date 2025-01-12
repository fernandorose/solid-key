import pool from '../database/connection';
import { Request, Response } from 'express';
import { idGen } from '../utils/idGen';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { JWT_SECRET_ADMIN, JWT_SECRET_USER } from '../config/config';
import Joi from 'joi';

dotenv.config();

interface CustomRequest extends Request {
  user?: JwtPayload & {
    role?: string;
  };
}

const io = new Server();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersData = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        u.last_login AS last_login,
        pc.id AS category_id,
        pc.category_name AS category_name,
        pc.created_at AS category_created_at,
        p.id AS password_id,
        p.site_name AS site_name,
        p.site_url AS site_url,
        p.site_username AS site_username,
        p.site_password AS site_password,
        p.created_at AS password_created_at
      FROM 
        users u
      LEFT JOIN 
        password_categories pc ON u.id = pc.user_id
      LEFT JOIN 
        password_category_mapping pcm ON pc.id = pcm.category_id
      LEFT JOIN 
        passwords p ON pcm.password_id = p.id
      ORDER BY 
        u.id, pc.id, p.id;
    `);

    // Reorganizar los usuarios en dos categorías basadas en el rol
    const users: {
      id: string;
      name: string;
      email: string;
      role: string;
      last_login: string;
      categories: {
        id: string;
        name: string;
        createdAt: string;
        passwords: {
          id: string;
          siteName: string;
          siteUrl: string;
          siteUsername: string;
          sitePassword: string;
          createdAt: string;
        }[];
      }[];
    }[] = [];

    const adminUsers: any[] = []; // Arreglo para almacenar admins
    const regularUsers: any[] = []; // Arreglo para almacenar usuarios regulares

    const userMap = new Map();

    for (const row of usersData.rows) {
      if (!userMap.has(row.user_id)) {
        userMap.set(row.user_id, {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          role: row.user_role,
          last_login: row.last_login,
          categories: [],
        });
      }

      const user = userMap.get(row.user_id);

      let category = user.categories.find(
        (cat: any) => cat.id === row.category_id
      );
      if (!category && row.category_id) {
        category = {
          id: row.category_id,
          name: row.category_name,
          createdAt: row.category_created_at,
          passwords: [],
        };
        user.categories.push(category);
      }

      if (category && row.password_id) {
        category.passwords.push({
          id: row.password_id,
          siteName: row.site_name,
          siteUrl: row.site_url,
          siteUsername: row.site_username,
          sitePassword: row.site_password,
          createdAt: row.password_created_at,
        });
      }
    }

    userMap.forEach((value) => {
      // Separar los usuarios según su rol
      if (value.role === 'admin') {
        adminUsers.push(value);
      } else {
        regularUsers.push(value);
      }
    });

    // Devolver los usuarios separados en dos arreglos
    res.status(200).json({ admins: adminUsers, users: regularUsers });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id; // Obtén el user_id de los parámetros de la solicitud

  try {
    const userData = await pool.query(
      `
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        u.last_login AS last_login,
        pc.id AS category_id,
        pc.category_name AS category_name,
        pc.created_at AS category_created_at,
        p.id AS password_id,
        p.site_name AS site_name,
        p.site_url AS site_url,
        p.site_username AS site_username,
        p.site_password AS site_password,
        p.created_at AS password_created_at
      FROM 
        users u
      LEFT JOIN 
        password_categories pc ON u.id = pc.user_id
      LEFT JOIN 
        password_category_mapping pcm ON pc.id = pcm.category_id
      LEFT JOIN 
        passwords p ON pcm.password_id = p.id
      WHERE
        u.id = $1 -- Filtra por el id del usuario
      ORDER BY 
        pc.id, p.id;
    `,
      [userId]
    );

    if (userData.rows.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const user: {
      id: string;
      name: string;
      email: string;
      role: string;
      last_login: string;
      categories: {
        id: string;
        name: string;
        createdAt: string;
        passwords: {
          id: string;
          siteName: string;
          siteUrl: string;
          siteUsername: string;
          sitePassword: string;
          createdAt: string;
        }[];
      }[];
    } = {
      id: userData.rows[0].user_id,
      name: userData.rows[0].user_name,
      email: userData.rows[0].user_email,
      role: userData.rows[0].user_role,
      last_login: userData.rows[0].last_login,
      categories: [],
    };

    // Mapear las categorías y contraseñas del usuario
    for (const row of userData.rows) {
      let category = user.categories.find((cat) => cat.id === row.category_id);

      if (!category && row.category_id) {
        category = {
          id: row.category_id,
          name: row.category_name,
          createdAt: row.category_created_at,
          passwords: [],
        };
        user.categories.push(category);
      }

      if (category && row.password_id) {
        category.passwords.push({
          id: row.password_id,
          siteName: row.site_name,
          siteUrl: row.site_url,
          siteUsername: row.site_username,
          sitePassword: row.site_password,
          createdAt: row.password_created_at,
        });
      }
    }

    // Devolver el usuario con sus categorías y contraseñas
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body; // Incluye `role` en los datos del cuerpo
  const id = idGen();
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error, value } = userSchema.validate(
    { name, email, password, role },
    { abortEarly: false }
  );
  // Valida el rol proporcionado o asigna uno por defecto
  const userRole = role && ['user', 'admin'].includes(role) ? role : 'user';

  try {
    const newUser = await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, value.name, value.email, hashedPassword, value.role]
    );
    io.emit('newUser', newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Eliminar la cookie del token
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Asegúrate de usar cookies seguras en producción
      sameSite: 'strict', // Evitar el envío de cookies en solicitudes de terceros
    });

    // Enviar respuesta de éxito
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({
      success: false,
      message: 'An error occurred while logging out.',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user; // Excluir contraseña de la respuesta

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const secret = user.role === 'admin' ? JWT_SECRET_ADMIN : JWT_SECRET_USER;

    const expiresIn = user.role === 'admin' ? '3h' : '1h';

    const token = jwt.sign(payload, secret as string, { expiresIn });

    // Actualizar el campo last_login con la fecha y hora actuales
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

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token },
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

export const validateToken = async (req: CustomRequest, res: Response) => {
  const token = req.cookies.token; // Accediendo al token desde la cookie

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  let decoded: JwtPayload | undefined;

  try {
    // Intentar descifrar con el primer secreto
    decoded = jwt.verify(token, JWT_SECRET_USER as string) as JwtPayload;
  } catch (errUser) {
    try {
      // Intentar descifrar con el segundo secreto
      decoded = jwt.verify(token, JWT_SECRET_ADMIN as string) as JwtPayload;
    } catch (errAdmin) {
      // Si ambos intentos fallan, responder con error
      res.status(403).json({
        success: false,
        message: 'Invalid or expired token.',
        error: 'Token could not be verified.',
      });
      return;
    }
  }

  // Si el token es válido, devolver la información
  if (decoded) {
    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      user: decoded, // Información decodificada del token
    });
    return;
  }

  // En caso de algún error inesperado
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
  });
};

export const decodeToken = async (req: Request, res: Response) => {
  const token = req.cookies.token; // Obtener el token de las cookies

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided.' });
  }

  try {
    let decoded: JwtPayload | undefined;

    // Intentar descifrar con ambos secretos
    try {
      decoded = jwt.verify(token, JWT_SECRET_USER as string) as JwtPayload;
    } catch (err) {
      decoded = jwt.verify(token, JWT_SECRET_ADMIN as string) as JwtPayload;
    }

    // Si se descifra correctamente, devolver los datos
    if (decoded) {
      res.status(200).json({
        success: true,
        message: 'Token decoded successfully.',
        data: decoded,
      });
    } else {
      throw new Error('Unable to decode token.');
    }
  } catch (err) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
      error: (err as Error).message,
    });
  }
};
export const changeUserEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING *',
      [email, id]
    );
    io.emit('updateUser', updatedUser.rows[0]);
    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// export const getUserById = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//     res.status(200).json({ user: user.rows[0] });
//   } catch (err) {
//     res.status(500).json({ message: (err as Error).message });
//   }
// };

export const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    io.emit('deleteUser', id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM users');
    io.emit('deleteAllUsers');
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
