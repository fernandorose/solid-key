import express from 'express';

import * as getControllers from '@/controllers/get';
import * as postControllers from '@/controllers/post';
import * as putControllers from '@/controllers/put';
import * as deleteControllers from '@/controllers/delete';

import { validateToken, requireAdmin } from '@/middlewares/validateToken';

const router = express.Router();

router
  .get('/users/get', validateToken, requireAdmin, getControllers.getUsers)
  .get('/users/get/:id', validateToken, getControllers.getUserById)

  .post('/users/create', postControllers.createUser)
  .post('/users/login', postControllers.loginUser)
  .post('/users/logout', postControllers.logoutUser)
  .post('/users/decode-token', postControllers.decodeToken)
  .post('/users/validate-token', postControllers.validateToken)

  .put('/users/update/email/:id', validateToken, putControllers.changeUserEmail)

  .delete('/users/delete', validateToken, deleteControllers.deleteAllUsers)
  .delete('/users/delete/:id', validateToken, deleteControllers.deleteUserById);

export default router;
