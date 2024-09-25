import App from "./App";
import AppContextProvider from "./context/app-context";
import "./i18n/config";
import "./index.css";
import ErrorBoundary from "@/ErrorBoundary";
import WebSocketContextProvider from "@/context/ws-context";
import { NextUIProvider } from "@nextui-org/react";
import "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-tooltip/dist/react-tooltip.css";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

// see https://vitejs.dev/guide/build#load-error-handling
window.addEventListener("vite:preloadError", (event) => {
  window.location.reload();
});

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <WebSocketContextProvider>
          <AppContextProvider>
            <NextUIProvider>
              {/* For persistent toasts over all pages */}
              <ToastContainer stacked closeOnClick />
              <App />
            </NextUIProvider>
          </AppContextProvider>
        </WebSocketContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
