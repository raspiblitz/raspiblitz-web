import { FC } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./i18n/config";
import Routes from "./Routes";
import AppContextProvider from "./store/app-context";
import SSEContextProvider from "./store/sse-context";

const App: FC = () => {
  return (
    <SSEContextProvider>
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    </SSEContextProvider>
  );
};

export default App;
