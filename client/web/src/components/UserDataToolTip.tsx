import React from "react";
import { useUser } from "./UserProvider";
import { css } from "@emotion/css";
import Logo from "./Logo";
import { formatTimestamp } from "./FormatDate";
import LogoutButton from "./LogoutButton";

const UserDataToolTip: React.FC = () => {
  const { user, isLoading, error } = useUser();

  return (
    <main
      className={css`
        width: fit-content;
        animation: show 200ms ease-in-out;
        margin-top: auto;
        article {
          border: solid 1px #000;
          border-radius: 5px;
          padding-inline: 10px;
          width: 250px;

          background: #000;
          backdrop-filter: blur(40px);
          color: #fff;
        }
      `}
    >
      <article>
        {isLoading ? (
          <div
            className={css`
              width: inherit;
            `}
          >
            <p>Cargando...</p>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : user ? (
          <div
            className={css`
              padding-block: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 10px;
            `}
          >
            <section
              className={css`
                &:hover {
                  cursor: pointer;
                }
              `}
            >
              <section
                className={css`
                  position: relative;
                  display: flex;
                `}
              >
                <p
                  className={css`
                    position: relative;
                    letter-spacing: -0.05rem;
                    display: flex;
                    font-weight: bold;
                    justify-content: space-between;
                    gap: 5px;
                    font-family: var(--mono-font);
                    padding-block-end: 5px;
                  `}
                >
                  {user.role === "admin" && (
                    <span
                      className={css`
                        font-family: var(--mono-font);
                        font-size: 0.9rem;
                        padding-inline: 3px;
                        background: var(--primary);
                        width: fit-content;
                        border-radius: 3px;
                        box-shadow: inset 0px 1px 0px 0px
                          rgba(255, 255, 255, 0.705);
                        border: solid 1px var(--primary);
                      `}
                    >
                      Admin
                    </span>
                  )}
                  {user.name}
                </p>
              </section>
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                  span {
                  }
                `}
              >
                <span
                  className={css`
                    font-size: 0.8rem;
                    font-family: var(--mono-font);
                    color: #969696;
                  `}
                >
                  use ID: {user.id}
                </span>
                <span
                  className={css`
                    font-size: 0.8rem;
                    font-family: var(--mono-font);
                    color: #969696;
                    text-decoration: underline;
                  `}
                >
                  Last login: {formatTimestamp(user.last_login)}
                </span>
              </div>
            </section>
            <div
              className={css`
                width: 100%;
                display: flex;
              `}
            >
              <LogoutButton />
            </div>
          </div>
        ) : (
          <p>No se pudo cargar la información del usuario.</p>
        )}
      </article>
    </main>
  );
};

export default UserDataToolTip;
