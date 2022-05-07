import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./i18n/config";
import "./index.css";
import AppContextProvider from "./store/app-context";
import SSEContextProvider from "./store/sse-context";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SSEContextProvider>
        <AppContextProvider>
          {/* For persistent toasts over all pages */}
          <ToastContainer />
          <App />
        </AppContextProvider>
      </SSEContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
