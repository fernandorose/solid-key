import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../layouts/Layout";
import { css } from "@emotion/css";
import UserDataToolTip from "../components/UserDataToolTip";
import NavBar from "../components/NavBar";

const Home: React.FC = () => {
  return (
    <Layout title="Home">
      <main
        className={css`
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 20px;
          height: 100dvh;
        `}
      >
        <NavBar />
        <UserDataToolTip />
      </main>
    </Layout>
  );
};

export default Home;
