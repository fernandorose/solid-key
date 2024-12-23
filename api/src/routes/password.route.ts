import express from "express";
import * as passwordControllers from "../controllers/password.controllers";

const router = express.Router();

router
  .get("/passwords/get", passwordControllers.getPasswords)
  .get("/passwords/categories/get", passwordControllers.getPasswordsCategory)
  .post(
    "/passwords/categories/create",
    passwordControllers.createPasswordCategory
  )
  .post("/passwords/create", passwordControllers.createPassword)
  .delete(
    "/passwords/delete/:id",
    passwordControllers.deletePasswordFromCategory
  );

export default router;
