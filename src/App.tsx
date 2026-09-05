import "./App.css";
import RequireAuth from "./components/RequireAuth";
import RequireSetup from "./components/RequireSetup";
import { AppContext } from "./context/app-context";
import "./i18n/config";
import { type FC, lazy, Suspense, useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import AppPage from "@/pages/Apps/AppPage";
import Login from "@/pages/Login";
import Layout from "./layouts/Layout";
import LoadingScreen from "./layouts/LoadingScreen";
import SkeletonLoadingScreen from "./layouts/SkeletonLoadingScreen";
import { SetupPhase } from "./models/setup.model";
import { ACCESS_TOKEN, parseJwt, REFRESH_TIME } from "./utils";
import { instance } from "./utils/interceptor";
import "react-toastify/dist/ReactToastify.css";

const LazySetup = lazy(() => import("./pages/Setup"));
const LazyHome = lazy(() => import("./pages/Home"));
const LazyApps = lazy(() => import("./pages/Apps"));
const LazySettings = lazy(() => import("./pages/Settings"));
const LazyAppInfo = lazy(() => import("./pages/Apps/AppInfo"));

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstCall, setFirstCall] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const { isLoggedIn, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (firstCall) {
      async function check() {
        setFirstCall(false);
        if (pathname.startsWith("/login")) {
          setIsLoading(false);
          return;
        }
        await instance.get("/setup/status").then((resp) => {
          const setupPhase = resp.data.setupPhase;
          const initialSync = resp.data.initialsync;
          if (setupPhase !== SetupPhase.DONE || initialSync === "running") {
            setNeedsSetup(true);
            navigate("/setup");
          } else {
            setNeedsSetup(false);
          }
          setIsLoading(false);
        });
      }

      check();
    }
  }, [firstCall, navigate, pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    function schedule(token: unknown) {
      const payload = parseJwt(token);
      const delay = payload ? REFRESH_TIME(payload.exp) : null;
      if (delay === null) {
        logout();
        return false;
      }
      timer = setTimeout(() => void doRefresh(), delay);
      return true;
    }

    async function doRefresh() {
      const previousToken = localStorage.getItem(ACCESS_TOKEN);
      if (!previousToken || controller.signal.aborted) return;
      const payload = parseJwt(previousToken);
      if (!payload || payload.exp * 1000 <= Date.now()) {
        logout();
        return;
      }
      try {
        const resp = await instance.post<unknown>(
          "system/refresh-token",
          {},
          {
            signal: controller.signal,
          },
        );
        if (controller.signal.aborted || localStorage.getItem(ACCESS_TOKEN) !== previousToken)
          return;
        const token = resp.data;
        if (typeof token !== "string") {
          logout();
        } else if (schedule(token)) {
          localStorage.setItem(ACCESS_TOKEN, token);
        }
      } catch {
        if (!controller.signal.aborted && localStorage.getItem(ACCESS_TOKEN) === previousToken) {
          logout();
        }
      }
    }

    schedule(localStorage.getItem(ACCESS_TOKEN));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isLoggedIn, logout]);

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
      <Route
        path="/apps/:appId/info"
        element={
          <Suspense fallback={<SkeletonLoadingScreen />}>
            <RequireAuth>
              <Layout>
                <LazyAppInfo />
              </Layout>
            </RequireAuth>
          </Suspense>
        }
      />
      <Route
        path="/apps/:appId"
        element={
          <Suspense fallback={<SkeletonLoadingScreen />}>
            <RequireAuth>
              <Layout>
                <AppPage />
              </Layout>
            </RequireAuth>
          </Suspense>
        }
      />
    </Routes>
  );
};

export default App;
