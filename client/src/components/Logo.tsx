import { css } from "@emotion/css";

const Logo = () => {
  return (
    <span
      className={css`
        font-size: 3rem;
        font-weight: 800;
        color: #000;
        letter-spacing: -0.2rem;
      `}
    >
      SolidKey
    </span>
  );
};

export default Logo;
