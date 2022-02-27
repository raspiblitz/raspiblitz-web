import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Layout from "./container/Layout/Layout";
import RequireAuth from "./container/RequireAuth/RequireAuth";
import "./i18n/config";
import Apps from "./pages/Apps";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
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
