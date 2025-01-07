import { css } from "@emotion/css";
import UserDataToolTip from "./UserDataToolTip";
import { useState, useRef } from "react";
import { useUser } from "./UserProvider";
import Logo from "./Logo";

const NavBar: React.FC = () => {
  return (
    <main
      className={css`
        display: flex;
        height: 100%;
        position: relative; /* Necesario para posicionar el tooltip */
        nav {
          display: flex;
          flex-direction: column;
          height: 100%;
          border: solid 1px black;
          border-radius: 5px;
          width: 250px;
          background: #000;
          color: #fff;
          padding: 20px;
          ul {
            display: flex;
            width: 100%;
            li {
              width: 100%;
              list-style: none;
            }
          }
        }
      `}
    >
      <nav>
        <ul>
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              align-items: end;

              span {
                font-family: var(--mono-font);
                font-size: 0.7rem;
                font-weight: bold;
              }
            `}
          >
            <Logo />
            <span>v1.0</span>
          </div>
        </ul>
      </nav>
    </main>
  );
};

export default NavBar;
