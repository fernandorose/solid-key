import Layout from '../layouts/Layout';
import { css } from '@emotion/css';
import NavBar from '../components/NavBar';

const Home: React.FC = () => {
  return (
    <Layout title="Home">
      <main
        className={css`
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 10px;
          height: 100dvh;
        `}
      >
        <NavBar />
      </main>
    </Layout>
  );
};

export default Home;
