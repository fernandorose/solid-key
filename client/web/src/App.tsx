import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import { UserProvider } from "./components/UserProvider";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/"
            element={
              <UserProvider>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </UserProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
