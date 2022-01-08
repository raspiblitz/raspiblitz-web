import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./i18n/config";
import "./index.css";
import AppContextProvider from "./store/app-context";
import SSEContextProvider from "./store/sse-context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SSEContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </SSEContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
