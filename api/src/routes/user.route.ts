import express from "express";
import * as userControllers from "../controllers/user.controllers";
import { validateToken, requireAdmin } from "../middlewares/validateToken";

const router = express.Router();

router
  .get("/users/get", validateToken, requireAdmin, userControllers.getUsers)
  .get("/users/get/:id", validateToken, userControllers.getUserById)
  .post("/users/create", userControllers.createUser)
  .post("/users/login", userControllers.loginUser)
  .put(
    "/users/update/email/:id",
    validateToken,
    userControllers.changeUserEmail
  )
  .delete("/users/delete", validateToken, userControllers.deleteAllUsers)
  .delete("/users/delete/:id", validateToken, userControllers.deleteUserById);

export default router;
