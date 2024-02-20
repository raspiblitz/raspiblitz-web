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
import { NextUIProvider } from "@nextui-org/react";

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
            <NextUIProvider>
              {/* For persistent toasts over all pages */}
              <ToastContainer stacked closeOnClick />
              <App />
            </NextUIProvider>
          </AppContextProvider>
        </SSEContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
