import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  last_login: string;
  categories: {
    id: string;
    name: string;
    createdAt: string;
    passwords: {
      id: string;
      siteName: string;
      siteUrl: string;
      siteUsername: string;
      sitePassword: string;
      createdAt: string;
    }[];
  }[];
}

interface UserContextProps {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Decodificar el token para obtener el ID del usuario
        const decodeResponse = await axios.post(
          "http://localhost:3000/api/v1/users/decode-token",
          {},
          { withCredentials: true }
        );

        const userId = decodeResponse.data.data.id;
        console.log(userId);

        // Usar el ID para obtener la información completa del usuario
        const userResponse = await axios.get(
          `http://localhost:3000/api/v1/users/get/${userId}`,
          { withCredentials: true }
        );

        setUser(userResponse.data);
        console.log(userResponse.data.last_login);
        setError(null);
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
        setError("No se pudo obtener los datos del usuario.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
