import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import BottomNav from './components/Navigation/BottomNav/BottomNav';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import Apps from './pages/Apps/Apps';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import AppContextProvider from './store/app-context';

const App = () => {
  return (
    <AppContextProvider>
      <div className='bg-gray-100 dark:bg-gray-700'>
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
            </Switch>
          </div>
          <BottomNav></BottomNav>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
};

export default App;
