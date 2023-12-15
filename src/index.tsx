import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./i18n/config";
import "./index.css";
import AppContextProvider from "./context/app-context";
import SSEContextProvider from "./context/sse-context";
import "react-tooltip/dist/react-tooltip.css";

import "i18next";
import ErrorBoundary from "ErrorBoundary";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SSEContextProvider>
          <AppContextProvider>
            {/* For persistent toasts over all pages */}
            <ToastContainer />
            <App />
          </AppContextProvider>
        </SSEContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
