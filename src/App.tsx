import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Apps from './components/Apps/Apps';
import Home from './components/Home/Home';
import BottomNav from './components/Navigation/BottomNav/BottomNav';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import Settings from './components/Settings/Settings';
import AppContextProvider from './store/app-context';

const App = () => {
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8080');

    webSocket.onopen = () => {
      setWs(webSocket);
    };
  }, []);

  return (
    <AppContextProvider>
      <div className='bg-gray-200 dark:bg-gray-600'>
        <BrowserRouter>
          <Header></Header>
          <div className='flex'>
            <SideDrawer></SideDrawer>
            <Switch>
              <Route exact path='/'>
                <Home ws={ws!} />
              </Route>
              <Route path='/apps'>
                <Apps />
              </Route>
              <Route path='/settings'>
                <Settings />
              </Route>
            </Switch>
          </div>
          <BottomNav></BottomNav>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
};

export default App;
