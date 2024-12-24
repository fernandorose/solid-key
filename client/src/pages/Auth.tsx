import { css } from "@emotion/css";
import Layout from "../layouts/Layout";
import Logo from "../components/Logo";

import { MdOutlineEmail } from "react-icons/md";
import { MdKey } from "react-icons/md";

const Auth = () => {
  return (
    <Layout title="Auth">
      <main
        className={css`
          display: grid;
          place-content: center;
          place-items: center;
          width: 100%;
          height: 100vh;
        `}
      >
        <div
          className={css`
            position: relative;
            display: flex;
            padding-block-end: 30px;
            h1 {
              display: flex;
              font-size: 1rem;
              font-family: var(--mono-font);
              background: linear-gradient(
                to top,
                rgb(2, 56, 19) 70%,
                rgb(0, 231, 116)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
            }
          `}
        >
          <Logo />
          <h1>Auth</h1>
        </div>
        <section
          className={css`
            border: solid 1px rgba(0, 0, 0, 0.1);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            padding: 10px;
            display: flex;
            width: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          <section
            className={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;
              div {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 5px;
                span {
                  font-weight: 500;
                  font-size: 0.8rem;
                }
                input {
                  position: relative;
                  padding: 10px;
                  padding-left: 30px;
                  outline: none;
                  border: solid 1px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
                  font-size: 0.9rem;
                  font-family: var(--mono-font);
                }
              }
            `}
          >
            <div>
              <span>Email</span>
              <div
                className={css`
                  position: relative;
                  span {
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                    color: rgb(117, 117, 117);
                  }
                `}
              >
                <span>
                  <MdOutlineEmail size={17} />
                </span>
                <input type="text" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <span>Password</span>
              <div
                className={css`
                  position: relative;
                  span {
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                    color: rgb(117, 117, 117);
                  }
                `}
              >
                <span>
                  <MdKey size={17} />
                </span>
                <input type="password" placeholder="password" />
              </div>
            </div>
            <div>
              <button
                className={css`
                  background: radial-gradient(
                    50% 100% at 50% 0%,
                    #606060 0%,
                    #000000 100%
                  );
                  outline: none;
                  border: none;
                  color: #ffffff;
                  padding: 10px;
                  border-radius: 5px;
                `}
              >
                Sign in
              </button>
            </div>
          </section>
        </section>
        <div
          className={css`
            padding: 10px;
          `}
        >
          <p
            className={css`
              font-size: 0.8rem;
            `}
          >
            You dont have an account yet?{" "}
            <span
              className={css`
                font-family: var(--mono-font);
              `}
            >
              Create one here
            </span>
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Auth;
