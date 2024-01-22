import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App";
import AppContextProvider from "./context/app-context";
import SSEContextProvider from "./context/sse-context";
import "./i18n/config";
import "./index.css";

import ErrorBoundary from "@/ErrorBoundary";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <StrictMode>
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
  </StrictMode>,
);
