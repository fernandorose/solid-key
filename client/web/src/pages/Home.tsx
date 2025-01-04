import { Navigate, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Layout title="Home">
      <main>
        <h1>Home</h1>
        <LogoutButton />
      </main>
    </Layout>
  );
};

export default Home;
