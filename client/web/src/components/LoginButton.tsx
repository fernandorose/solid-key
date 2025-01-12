import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../styles/StyledComponents.style';

interface LoginButtonProps {
  email: string;
  password: string;
  onSuccess: (data: { user: object; token: string }) => void;
  onError: (message: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  email,
  password,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      onError('Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/users/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        onSuccess(response.data.data);
      } else {
        onError(response.data.message || 'Login failed.');
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'An error occurred.';

      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Log in'}
    </Button>
  );
};

export default LoginButton;
