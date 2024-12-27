import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

// Middleware para validar el token con dos secretos
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    let decoded: JwtPayload | undefined;

    // Intentar descifrar con el primer secreto
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_USER as string
      ) as JwtPayload;
    } catch (err) {
      // Si falla, intentar con el segundo secreto
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_ADMIN as string
      ) as JwtPayload;
    }

    // Si no se descifró correctamente, lanzar error
    if (!decoded) {
      throw new Error("Invalid token");
    }

    // Agregar el usuario al objeto de la solicitud
    (req as CustomRequest).user = decoded;
    next();
  } catch (err) {
    res
      .status(403)
      .json({
        message: "Invalid or expired token.",
        error: (err as Error).message,
      });
  }
};

// Middleware para verificar si el usuario es admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as CustomRequest).user;

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }

  next(); // Continuar si es admin
};
