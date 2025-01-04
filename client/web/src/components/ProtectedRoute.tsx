import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: React.ReactElement; // Componente que se debe renderizar si está autorizado
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // `null` indica que está cargando

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

  // Mostrar un mensaje de carga mientras se valida el token
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Renderizar el contenido protegido si está autenticado
  return children;
};

export default ProtectedRoute;
