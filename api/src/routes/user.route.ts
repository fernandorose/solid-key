import express from "express";
import * as userControllers from "../controllers/user.controllers";

const router = express.Router();

router
  .get("/users/get", userControllers.getUsers)
  .get("/users/get/:id", userControllers.getUserById)
  .post("/users/create", userControllers.createUser)
  .delete("/users/delete", userControllers.deleteAllUsers)
  .delete("/users/delete/:id", userControllers.deleteUserById);

export default router;
