import { lazy, Suspense, useContext, useState } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import Layout from "./container/Layout/Layout";
import LoadingScreen from "./container/LoadingScreen/LoadingScreen";
import SkeletonLoadingScreen from "./container/SkeletonLoadingScreen/SkeletonLoadingScreen";
import Login from "./pages/Login/Login";
import Setup from "./pages/Setup/Setup";
import { AppContext } from "./store/app-context";

const LazyHome = lazy(() => import("./pages/Home/Home"));
const LazyApps = lazy(() => import("./pages/Apps/Apps"));
const LazySettings = lazy(() => import("./pages/Settings/Settings"));

const Routes: React.FC = () => {
  const appCtx = useContext(AppContext);
  const [isLoading] = useState(false);
  const [setupDone] = useState(true);

  // TODO: uncomment when setup support is done
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const req = await instance.get('setup/status');
  //     if (req.data.progress === 100) {
  //       setSetupDone(true);
  //     } else {
  //       setSetupDone(false);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!setupDone && !isLoading) {
    return (
      <BrowserRouter>
        <Route path="/setup" element={<Setup />} />
        <Route path="*" element={<Navigate to="/setup" />} />
        {/* <Route render={() => <Redirect to="/setup" />} /> */}
        {/* <Route>
          <Redirect to="/setup" />
        </Route> */}
      </BrowserRouter>
    );
  }

  if (setupDone && !isLoading && !appCtx.isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />

          {/* <Route>
            <Redirect to="/login" />
          </Route> */}
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <Suspense fallback={<SkeletonLoadingScreen />}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* <Route exact path="/">
              <Redirect to="/home" />
            </Route> */}

            <Route path="/home" element={<LazyHome />} />
            <Route path="/apps" element={<LazyApps />} />
            <Route path="/settings" element={<LazySettings />} />

            <Route path="*" element={<Navigate to="/home" />} />


            {/* <Route>
              <Redirect to="/home" />
            </Route> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </Suspense>
  );
};

export default Routes;
