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
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: #f7f7f7;
        `}
      >
        <section
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            padding: 10px;
            border: solid 1px rgba(0, 0, 0, 0.1);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 30px;
            background: white;
            margin: 20px;
            width: 700px;
            background: radial-gradient(
              50% 100% at 50% 0%,
              #ffffff 0%,
              #ececec 100%
            );
          `}
        >
          <div
            className={css`
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-block-end: 30px;
              img {
                width: 300px;
              }
              p {
                display: flex;
                font-size: 2rem;
                font-weight: 700;
                font-family: var(--alternate-font);
                letter-spacing: -0.15rem;
              }
            `}
          >
            <Logo />
            <p>Log In</p>
          </div>
          <section
            className={css`
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
                      top: calc(50% + 3px);
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
                    border: solid 1px black;
                    color: #ffffff;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.493);
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
                  color: #007bff;
                  font-weight: 500;
                `}
              >
                Create one here
              </span>
            </p>
          </div>
        </section>
        <section
          className={css`
            display: grid;
            place-content: center;
            place-items: center;
            width: 100%;
            background: url("./auth2.webp") center center;
            background-size: cover;
            border-radius: 30px;
            margin: 20px 20px 20px 0;
          `}
        ></section>
      </main>
    </Layout>
  );
};

export default Auth;
