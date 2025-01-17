import { Request, Response } from 'express';
import pool from '@/database/connection';
import { Server } from 'socket.io';

const io = new Server();

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
