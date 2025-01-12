import React, { useState } from 'react';
import { useUser } from './UserProvider';
import { css } from '@emotion/css';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';

const UserData: React.FC = () => {
  const { user, isLoading, error } = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Estado para manejar animaciones

  if (isLoading) {
    return (
      <section
        className={css`
          display: flex;
          flex-direction: column;
          padding: 10px;
          width: 100%;
          .skeleton {
            background: linear-gradient(
              90deg,
              #686868 25%,
              #f8f8f8 50%,
              #686868 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 2px;
          }
          .skeleton-text {
            width: 100%;
            height: 1rem;
            margin-bottom: 8px;
          }
          .skeleton-small {
            width: 80%;
            height: 0.8rem;
          }
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      >
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-small"></div>
      </section>
    );
  }

  if (error) {
    return <p>Error loading user data</p>;
  }

  if (!user) {
    return <p>No user data available</p>;
  }

  const handleMouseLeave = () => {
    setIsAnimating(true); // Inicia la animación de salida
    setTimeout(() => {
      setShowLogout(false); // Desmonta el componente después de 300ms
      setIsAnimating(false); // Reinicia el estado de animación
    }, 200);
  };

  return (
    <>
      <section
        onMouseEnter={() => setShowLogout(true)}
        className={css`
          display: flex;
          flex-direction: column;
          padding: 10px;
          width: 100%;
          transition: 300ms;
          &:hover {
            cursor: pointer;
            background: #282c34;
          }
          h1 {
            font-size: 0.8rem;
          }
          span {
            font-size: 0.8rem;
            opacity: 0.5;
          }
        `}
      >
        <section
          className={css`
            display: flex;
            align-items: center;
            gap: 10px;
          `}
        >
          <div>
            <h1>{user?.name}</h1>
            <span>{user?.email}</span>
          </div>
        </section>
      </section>
      {showLogout && (
        <section
          onMouseLeave={handleMouseLeave}
          className={css`
            position: absolute;
            right: -210px;
            width: 250px;
            bottom: 0px;
            padding-left: 50px;
            animation: ${isAnimating
              ? 'slideOut 200ms ease-out'
              : 'bounce 200ms ease-out'};

            @keyframes bounce {
              0% {
                transform: translateX(-20px);
                opacity: 0;
              }
              50% {
                transform: translateX(10px);
                opacity: 1;
              }
              75% {
                transform: translateX(-5px);
              }
              100% {
                transform: translateX(0);
              }
            }

            @keyframes slideOut {
              0% {
                transform: translateX(0);
                opacity: 1;
              }
              100% {
                transform: translateX(-20px);
                opacity: 0;
              }
            }
          `}
        >
          <div
            className={css`
              display: flex;
              flex-direction: column;
              background: #21252b;
              backdrop-filter: blur(30px);
              color: #fff;
              padding: 10px;
              box-shadow: 0 0 10px #21252b73;
              gap: 5px;
              ul {
                display: flex;
                flex-direction: column;

                li {
                  padding: 5px;
                  cursor: pointer;
                  &:hover {
                    background: #282c34;
                  }
                  a {
                    font-size: 0.8rem;
                  }
                }
              }
            `}
          >
            <ul>
              <li>
                <Link to={''}>Profile</Link>
              </li>
            </ul>
            <ul>
              <LogoutButton />
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

export default UserData;
