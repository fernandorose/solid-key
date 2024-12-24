import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Verificar si el encabezado de autorización está presente
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Agregar el usuario decodificado al objeto de la solicitud
    (req as CustomRequest).user = decoded;

    next(); // Continuar al siguiente middleware o controlador
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default validateToken;
