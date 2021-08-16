import { lazy, Suspense, useContext, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import BottomNav from './components/Navigation/BottomNav/BottomNav';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import LoadingScreen from './container/LoadingScreen/LoadingScreen';
import './i18n/config';
import Setup from './pages/Setup/Setup';
import { AppContext } from './store/app-context';

const Login = lazy(() => import('./pages/Login/Login'));
const Home = lazy(() => import('./pages/Home/Home'));
const Apps = lazy(() => import('./pages/Apps/Apps'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

const App = () => {
  const appCtx = useContext(AppContext);
  const [loading] = useState(false);
  const [setupDone] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const req = await instance.get('setup/status');
  //     if (req.data.progress === 100) {
  //       setSetupDone(true);
  //     } else {
  //       setSetupDone(false);
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      {!setupDone && loading && <LoadingScreen />}

      {!setupDone && !loading && (
        <BrowserRouter>
          <Route path='/setup' component={Setup} />
          <Route>
            <Redirect to='/setup' />
          </Route>
        </BrowserRouter>
      )}

      {setupDone && !loading && !appCtx.isLoggedIn && (
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route>
              <Redirect to='/login' />
            </Route>
          </Switch>
        </BrowserRouter>
      )}

      {setupDone && !loading && appCtx.isLoggedIn && (
        <BrowserRouter>
          <Header></Header>
          <SideDrawer></SideDrawer>
          <Switch>
            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>
            <Route path='/home' component={Home} />
            <Route path='/apps' component={Apps} />
            <Route path='/settings' component={Settings} />
            <Route>
              <Redirect to='/home' />
            </Route>
          </Switch>
          <BottomNav></BottomNav>
        </BrowserRouter>
      )}
    </Suspense>
  );
};

export default App;
