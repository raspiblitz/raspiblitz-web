import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import AppContextProvider from './store/app-context';
import SSEContextProvider from './store/sse-context';

ReactDOM.render(
  <React.StrictMode>
    <SSEContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </SSEContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
