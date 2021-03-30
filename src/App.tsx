import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Bitcoin from './components/Bitcoin/Bitcoin';
import Home from './components/Home/Home';
import Lightning from './components/Lightning/Lightning';
import BottomNav from './components/Navigation/BottomNav/BottomNav';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import Services from './components/Services/Services';
import Settings from './components/Settings/Settings';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header></Header>
        <div className='flex'>
          <SideDrawer></SideDrawer>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/bitcoin'>
              <Bitcoin />
            </Route>
            <Route path='/lightning'>
              <Lightning />
            </Route>
            <Route path='/services'>
              <Services />
            </Route>
            <Route path='/settings'>
              <Settings />
            </Route>
          </Switch>
        </div>
        <BottomNav></BottomNav>
      </BrowserRouter>
    </div>
  );
}

export default App;
