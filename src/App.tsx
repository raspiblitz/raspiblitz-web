import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import BottomNav from './components/Navigation/BottomNav/BottomNav';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import LoadingScreen from './container/LoadingScreen/LoadingScreen';
import './i18n/config';
import { AppContext } from './store/app-context';

const Login = lazy(() => import('./pages/Login/Login'));
const Home = lazy(() => import('./pages/Home/Home'));
const Apps = lazy(() => import('./pages/Apps/Apps'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

const App = () => {
  const appCtx = useContext(AppContext);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className='bg-gray-100 dark:bg-gray-700 transition-colors'>
        {!appCtx.isLoggedIn && (
          <BrowserRouter>
            <Switch>
              <Route path='/login' component={Login} />
              <Route>
                <Redirect to='/login' />
              </Route>
            </Switch>
          </BrowserRouter>
        )}

        {appCtx.isLoggedIn && (
          <BrowserRouter>
            <Header></Header>
            <div className='flex'>
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
            </div>
            <BottomNav></BottomNav>
          </BrowserRouter>
        )}
      </div>
    </Suspense>
  );
};

export default App;
