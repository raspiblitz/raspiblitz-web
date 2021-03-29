import React from 'react';
import './App.css';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import Dashboard from './components/Home/Home';
import { BrowserRouter } from 'react-router-dom';
import BottomNav from './components/Navigation/BottomNav/BottomNav';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header></Header>
        <SideDrawer></SideDrawer>
        <Dashboard></Dashboard>
        <BottomNav></BottomNav>
      </BrowserRouter>
    </div>
  );
}

export default App;
