import pool from "../database/connection";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
  user?: {
    role?: string;
  };
}
import { idGen } from "../utils/idGen";
import bcrypt from "bcrypt";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/nodemailerTransporter";
import { keyGen } from "../utils/keyGen";

const io = new Server();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersData = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
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
      if (value.role === "admin") {
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

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body; // Incluye `role` en los datos del cuerpo
  const id = idGen();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Valida el rol proporcionado o asigna uno por defecto
  const userRole = role && ["user", "admin"].includes(role) ? role : "user";

  try {
    const newUser = await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, name, email, hashedPassword, userRole]
    );
    io.emit("newUser", newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (user.rows[0].role === "admin") {
      const adminToken = jwt.sign(
        {
          id: user.rows[0].id,
          email: user.rows[0].email,
          role: user.rows[0].role,
        },
        process.env.JWT_SECRET_ADMIN as string,
        { expiresIn: "3h" }
      );
      res.status(200).json({ user: user.rows[0], admin_token: adminToken });
      return;
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET_USER as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user: user.rows[0], token: token });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const changeUserEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
      [email, id]
    );
    io.emit("updateUser", updatedUser.rows[0]);
    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    io.emit("deleteUser", id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM users");
    io.emit("deleteAllUsers");
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
