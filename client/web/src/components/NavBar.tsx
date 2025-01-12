import { css } from '@emotion/css';
import Logo from './Logo';
import UserData from './UserData';

const NavBar: React.FC = () => {
  return (
    <main
      className={css`
        display: flex;
        height: 100%;
        width: 250px;
        position: relative;
        box-shadow: 0 0 20px rgb(0, 0, 0, 0.5);
        nav {
          position: relative;

          border-radius: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: #21252b;
          color: #fff;
          padding: 10px;
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
              width: 100%;
              span {
                font-family: var(--mono-font);
                font-size: 0.7rem;
              }
            `}
          >
            <img
              className={css`
                width: 100px;
              `}
              src="/logo.svg"
              alt=""
            />
            <span>v1.0</span>
          </div>
        </ul>
        <ul
          className={css`
            margin-top: auto;
          `}
        >
          <UserData />
        </ul>
      </nav>
    </main>
  );
};

export default NavBar;
