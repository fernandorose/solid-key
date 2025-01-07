import { css } from "@emotion/css";
import React from "react";

const Logo = () => {
  return (
    <img
      className={css`
        width: 100px;
      `}
      src="./logo.svg"
      alt="logo"
    />
  );
};

export default Logo;
