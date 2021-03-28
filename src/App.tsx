import React from 'react';
import './App.css';
import Header from './components/Navigation/Header/Header';
import SideDrawer from './components/Navigation/SideDrawer/SideDrawer';
import Dashboard from './components/Dashboard/Dashboard';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header></Header>
        <SideDrawer></SideDrawer>
        <Dashboard></Dashboard>
      </BrowserRouter>
    </div>
  );
}

export default App;
