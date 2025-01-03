import pool from "../database/connection";
import { Request, Response } from "express";
import { idGen } from "../utils/idGen";
import bcrypt from "bcrypt";
import { Server } from "socket.io";
import crypto from "crypto";

const io = new Server();

export const getPasswords = async (req: Request, res: Response) => {
  try {
    const passwords = await pool.query("SELECT * FROM passwords");
    res.status(200).json({ passwords: passwords.rows });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getPasswordsCategory = async (req: Request, res: Response) => {
  try {
    const categories = await pool.query("SELECT * FROM password_categories");
    res.status(200).json({ categories: categories.rows });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
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
    res.status(400).json({ message: "All required fields must be provided." });
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
        .join(", ");

      const mappingParams = mappings.flat();

      await pool.query(
        `
        INSERT INTO password_category_mapping (id, password_id, category_id)
        VALUES ${mappingValues};
        `,
        mappingParams
      );
    }

    io.emit("newPassword", { id, user_id, site_name, site_url, site_username });
    res
      .status(201)
      .json({ message: "Password created successfully.", passwordId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deletePasswordFromCategory = async (
  req: Request,
  res: Response
) => {
  const { password_id, category_id } = req.body;

  if (!password_id || !category_id) {
    res.status(400).json({
      message: "Both password_id and category_id must be provided.",
    });
  }

  try {
    // Eliminar el mapeo entre la contraseña y la categoría
    const deleteResult = await pool.query(
      `
      DELETE FROM password_category_mapping
      WHERE password_id = $1 AND category_id = $2
      RETURNING *;
      `,
      [password_id, category_id]
    );

    // Verificar si se eliminó alguna fila
    if (deleteResult.rowCount === 0) {
      res.status(404).json({
        message: "Mapping not found or already deleted.",
      });
    }

    io.emit("deletePasswordFromCategory", deleteResult.rows[0]);
    res.status(200).json({
      message: "Password successfully removed from category.",
      deletedMapping: deleteResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createPasswordCategory = async (req: Request, res: Response) => {
  const { category_name, user_id } = req.body;
  const id = idGen();
  try {
    const newCategory = await pool.query(
      "INSERT INTO password_categories (id, category_name, user_id) VALUES ($1, $2, $3) RETURNING *",
      [id, category_name, user_id]
    );
    io.emit("newCategory", newCategory.rows[0]);
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
      res.status(400).json({ error: "Length must be between 4 and 128." });
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
        .json({ error: "At least one character type must be selected." });
      return;
    }

    // Caracteres disponibles
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    let characterPool = "";
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeLowercase) characterPool += lowercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    // Generación de la contraseña
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characterPool.length);
      password += characterPool[randomIndex];
    }

    // Respuesta
    res.status(200).json({ password });
  } catch (error) {
    console.error("Error generating password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
