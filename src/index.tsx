import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import AppContextProvider from './store/app-context';

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
