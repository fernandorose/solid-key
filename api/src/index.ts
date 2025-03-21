import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import pool from "./database/connection";

import userRoutes from "./routes/user.route";
import passwordRoutes from "./routes/password.route";
import { validateToken } from "./middlewares/validateToken";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });
});

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173", // Solo permitir esta URL
  credentials: true, // Permitir envío de cookies y headers de autenticación
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1", userRoutes);
app.use("/api/v1", validateToken, passwordRoutes);

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL");
  release();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
