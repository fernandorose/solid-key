import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AuthRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Llamar al endpoint para validar el token, las cookies se enviarán automáticamente
        const response = await axios.post(
          "http://localhost:3000/api/v1/users/validate-token",
          {},
          { withCredentials: true } // Importante para enviar cookies al servidor
        );

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al validar el token:", error);
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // Mientras estamos verificando la autenticación, mostrar un cargando
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Si el usuario ya está autenticado, redirigir a la página principal
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar el contenido de la ruta de autenticación
  return children;
};

export default AuthRoute;
