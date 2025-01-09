import React from 'react';
import { useUser } from './UserProvider';
import { css } from '@emotion/css';
import { BsPersonFillGear } from 'react-icons/bs';

const UserData: React.FC = () => {
  const { user, isLoading, error } = useUser();

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

  return (
    <section
      className={css`
        display: flex;
        flex-direction: column;
        padding: 10px;
        width: 100%;
        transition: 300ms;
        &:hover {
          cursor: pointer;
        }
        h1 {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.05rem;
        }
        span {
          font-family: var(--condensed-font);
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
          <BsPersonFillGear size={30} />
        </div>
        <div>
          <h1>{user?.name}</h1>
          <span>{user?.email}</span>
        </div>
      </section>
    </section>
  );
};

export default UserData;
