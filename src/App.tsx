import { FC, lazy, Suspense, useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Layout from "./container/Layout/Layout";
import LoadingScreen from "./container/LoadingScreen/LoadingScreen";
import RequireAuth from "./container/RequireAuth/RequireAuth";
import RequireSetup from "./container/RequireSetup/RequireSetup";
import SkeletonLoadingScreen from "./container/SkeletonLoadingScreen/SkeletonLoadingScreen";
import "./i18n/config";
import { SetupPhase } from "./models/setup.model";
import Login from "./pages/Login";
import { AppContext } from "./store/app-context";
import { instance } from "./util/interceptor";

const LazySetup = lazy(() => import("./pages/Setup"));
const LazyHome = lazy(() => import("./pages/Home"));
const LazyApps = lazy(() => import("./pages/Apps"));
const LazySettings = lazy(() => import("./pages/Settings"));

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstCall, setFirstCall] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    if (firstCall) {
      async function check() {
        setFirstCall(false);
        if (pathname.includes("/login")) {
          return;
        }
        await instance.get("/setup/status").then((resp) => {
          const setupPhase = resp.data.setupPhase;
          const initialsync = resp.data.initialsync;
          if (setupPhase !== SetupPhase.DONE || initialsync === "running") {
            setNeedsSetup(true);
            navigate("/setup");
          } else {
            setNeedsSetup(false);
          }
        });
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
      <Route
        path="/setup"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <RequireSetup needsSetup={needsSetup}>
              <LazySetup />
            </RequireSetup>
          </Suspense>
        }
      />
      <Route
        path="/home"
        element={
          <Suspense fallback={<SkeletonLoadingScreen />}>
            <RequireAuth>
              <Layout>
                <LazyHome />
              </Layout>
            </RequireAuth>
          </Suspense>
        }
      />
      <Route
        path="/apps"
        element={
          <Suspense fallback={<SkeletonLoadingScreen />}>
            <RequireAuth>
              <Layout>
                <LazyApps />
              </Layout>
            </RequireAuth>
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<SkeletonLoadingScreen />}>
            <RequireAuth>
              <Layout>
                <LazySettings />
              </Layout>
            </RequireAuth>
          </Suspense>
        }
      />
    </Routes>
  );
};

export default App;
