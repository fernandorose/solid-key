import { css } from "@emotion/css";
import Layout from "../layouts/Layout";
import { Button, Input } from "../components/styledComponents.style";
import LoginButton from "../components/LoginButton";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<object | null>(null);

  const handleSuccess = (data: { user: object; token: string }) => {
    setUser(data.user);
    setError(null);
    console.log("Token:", data.token);
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
        `}
      >
        <section
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 500px;
            height: 100dvh;
            border-right: solid 1px #00000011;
            padding: 20px;
            section {
              animation: fadeIn 0.7s ease;
            }
            div {
              text-align: center;
              padding-block: 50px;
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
            <h1>SolidKey</h1>
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
                  font-size: 0.8rem;
                  color: #0e7556;

                  cursor: pointer;
                }
              }
              article {
                gap: 10px;
                display: flex;
                flex-direction: column;
                p {
                  font-weight: 700;
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
              You don't have an account yet? <span>Create one here</span>
            </p>
          </section>
        </section>

        <section
          className={css`
            width: 100%;
            height: 100vh;
            @media (max-width: 1024px) {
              display: none;
            }
          `}
        >
          <div
            className={css`
              position: relative;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url("/auth2.webp");
              background-size: cover;
              border-radius: 50px;
              &::after {
                content: "";
                width: 100%;
                height: 100%;
                inset: 0;
                position: absolute;
                background: inherit;
                filter: blur(50px) saturate(400%);
                z-index: -1;
              }
            `}
          ></div>
        </section>
      </main>
    </Layout>
  );
};

export default Auth;
