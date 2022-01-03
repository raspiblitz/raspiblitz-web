import { FC, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Layout from "./container/Layout/Layout";
import "./i18n/config";
import Apps from "./pages/Apps/Apps";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";
import { AppContext } from "./store/app-context";

const App: FC = () => {
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/apps"
        element={
          <Layout>
            <Apps />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
