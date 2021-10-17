import { lazy, Suspense, useContext, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
        <Route path="/setup" component={Setup} />
        <Route>
          <Redirect to="/setup" />
        </Route>
      </BrowserRouter>
    );
  }

  if (setupDone && !isLoading && !appCtx.isLoggedIn) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <Suspense fallback={<SkeletonLoadingScreen />}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>

            <Route path="/home" component={LazyHome} />
            <Route path="/apps" component={LazyApps} />
            <Route path="/settings" component={LazySettings} />

            <Route>
              <Redirect to="/home" />
            </Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    </Suspense>
  );
};

export default Routes;
