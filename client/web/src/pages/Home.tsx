import { Navigate, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Layout title="Home">
      <main>
        <h1>Home</h1>
        <button
          onClick={() => {
            navigate("/auth");
          }}
        >
          Auth
        </button>
      </main>
    </Layout>
  );
};

export default Home;
