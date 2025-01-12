import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Logout } from '../styles/StyledComponents.style';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout usando la URL base desde las variables de entorno
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );

      // Verifica si la respuesta es exitosa
      if (response.data.success) {
        // Redirigir al usuario a la página de login
        navigate('/auth');
      } else {
        console.error('Error al cerrar sesión:', response.data.message);
        alert('Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return <Logout onClick={handleLogout}>Logout</Logout>;
};

export default LogoutButton;
