import express from 'express';

import * as getControllers from '@/controllers/get';
import * as postControllers from '@/controllers/post';
import * as deleteControllers from '@/controllers/delete';

const router = express.Router();

router
  .get('/passwords/get', getControllers.getPasswords)
  .get('/passwords/categories/get', getControllers.getPasswordsCategory)

  .post('/passwords/categories/create', postControllers.createPasswordCategory)
  .post('/passwords/create', postControllers.createPassword)
  .post('/passwords/create/key', postControllers.createPasswordKey)

  .delete(
    '/passwords/delete/:id',
    deleteControllers.deletePasswordFromCategory
  );

export default router;
