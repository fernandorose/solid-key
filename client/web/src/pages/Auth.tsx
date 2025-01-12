import { css } from '@emotion/css';
import Layout from '../layouts/Layout';
import { Input } from '../styles/StyledComponents.style';
import LoginButton from '../components/LoginButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<object | null>(null);

  const navigate = useNavigate();

  const handleSuccess = (data: { user: object; token: string }) => {
    setUser(data.user);
    setError(null);
    console.log('Token:', data.token);
    navigate('/');
  };

  const handleError = (message: string) => {
    setError(message);
  };
  return (
    <Layout title="Auth">
      <main
        className={css`
          display: flex;
          width: 100%;
          height: 100dvh;
          justify-content: center;
          align-items: center;
          padding: 30px;
        `}
      >
        <section
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 400px;
            height: 100%;
            border: solid 1px #00000011;

            section {
              animation: fadeIn 0.7s ease;
            }
            div {
              text-align: center;
              padding-bottom: 50px;
              animation: fadeIn 1s ease;
              h1 {
                font-weight: 800;
                font-size: 4rem;
                letter-spacing: -0.3rem;
              }
              p {
                color: #00000099;
                font-size: 0.85rem;
              }
            }
            @media (max-width: 1024px) {
              border: none;
              width: 100%;
              justify-content: center;
              align-items: center;
              display: flex;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        >
          <div>
            <Logo />
            <p>Innovative and Solid solution for managing</p>
            <p>your passwords with ease and security.</p>
          </div>
          <section
            className={css`
              display: flex;
              flex-direction: column;
              gap: 20px;
              p {
                font-size: 0.8rem;
                span {
                  color: #0e7556;
                  text-decoration: underline;
                  cursor: pointer;
                  font-family: var(--mono-font);
                }
              }
              article {
                gap: 10px;
                display: flex;
                flex-direction: column;
                p {
                }
              }
            `}
          >
            <article>
              <p>Email address</p>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </article>
            <article>
              <p>Password</p>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </article>
            <LoginButton
              email={email}
              password={password}
              onSuccess={handleSuccess}
              onError={handleError}
            />
            {error && (
              <p
                className={css`
                  color: var(--alert-color);
                  text-align: center;
                `}
              >
                {error}
              </p>
            )}
            <p>
              You don't have an account yet? <span>Create one here</span>
            </p>
          </section>
        </section>
      </main>
    </Layout>
  );
};

export default Auth;
