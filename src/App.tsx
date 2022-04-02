import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Route, Routes, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Layout from "./container/Layout/Layout";
import LoadingScreen from "./container/LoadingScreen/LoadingScreen";
import RequireAuth from "./container/RequireAuth/RequireAuth";
import "./i18n/config";
import { SetupPhase } from "./models/setup.model";
import Apps from "./pages/Apps";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import { AppContext } from "./store/app-context";
import { instance } from "./util/interceptor";

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstCall, setFirstCall] = useState(true);
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    if (firstCall) {
      async function check() {
        setFirstCall(false);
        if (pathname === "/login") return;
        const resp = await instance.get("/setup/status");
        if (resp) {
          const setupPhase = resp.data.setupPhase;
          const initialsync = resp.data.initialsync;
          console.info(`initialsync(${initialsync})`);
          if (setupPhase !== SetupPhase.DONE || initialsync === "running") {
            navigate("/setup");
          }
        }
      }
      check();
    }
    setIsLoading(false);
  }, [isLoggedIn, firstCall, navigate, pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<Setup />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Layout>
              <Home />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/apps"
        element={
          <RequireAuth>
            <Layout>
              <Apps />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Layout>
              <Settings />
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
