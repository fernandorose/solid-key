import { Request, Response } from 'express';
import pool from '@/database/connection';

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

    const adminUsers: any[] = [];
    const regularUsers: any[] = [];

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
      if (value.role === 'admin') {
        adminUsers.push(value);
      } else {
        regularUsers.push(value);
      }
    });

    res.status(200).json({ admins: adminUsers, users: regularUsers });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

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

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// password controllers

export const getPasswords = async (req: Request, res: Response) => {
  try {
    const passwords = await pool.query('SELECT * FROM passwords');
    res.status(200).json({ passwords: passwords.rows });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getPasswordsCategory = async (req: Request, res: Response) => {
  try {
    const categories = await pool.query('SELECT * FROM password_categories');
    res.status(200).json({ categories: categories.rows });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
