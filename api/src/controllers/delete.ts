import { Request, Response } from 'express';
import pool from '@/database/connection';
import { Server } from 'socket.io';

const io = new Server();

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

export const deletePasswordFromCategory = async (
  req: Request,
  res: Response
) => {
  const { password_id, category_id } = req.body;

  if (!password_id || !category_id) {
    res.status(400).json({
      message: 'Both password_id and category_id must be provided.',
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
        message: 'Mapping not found or already deleted.',
      });
    }

    io.emit('deletePasswordFromCategory', deleteResult.rows[0]);
    res.status(200).json({
      message: 'Password successfully removed from category.',
      deletedMapping: deleteResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
