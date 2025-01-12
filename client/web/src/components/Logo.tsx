import { css } from '@emotion/css';
import React from 'react';

const Logo = () => {
  return (
    <img
      className={css`
        width: 300px;
      `}
      src="./logo2.svg"
      alt="logo"
    />
  );
};

export default Logo;
