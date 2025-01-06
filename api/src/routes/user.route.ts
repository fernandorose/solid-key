import express from "express";
import * as userControllers from "../controllers/user.controllers";
import { validateToken, requireAdmin } from "../middlewares/validateToken";

const router = express.Router();

router
  .get("/users/get", validateToken, requireAdmin, userControllers.getUsers)
  .get("/users/get/:id", validateToken, userControllers.getUserById)
  .post("/users/create", userControllers.createUser)
  .post("/users/login", userControllers.loginUser)
  .post("/users/validate-token", userControllers.validateToken)
  .post("/users/logout", userControllers.logoutUser)
  .post("/users/decode-token", userControllers.decodeToken)
  .put(
    "/users/update/email/:id",
    validateToken,
    userControllers.changeUserEmail
  )
  .delete("/users/delete", validateToken, userControllers.deleteAllUsers)
  .delete("/users/delete/:id", validateToken, userControllers.deleteUserById);

export default router;
