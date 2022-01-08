import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { parseJwt, retrieveSettings, saveSettings } from "../util/util";
import { SSEContext } from "./sse-context";

interface AppContextType {
  isLoggedIn: boolean;
  darkMode: boolean;
  unit: Unit;
  walletLocked: boolean;
  toggleUnit: () => void;
  toggleDarkMode: () => void;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  setWalletLocked: Dispatch<SetStateAction<boolean>>;
}

export enum Unit {
  BTC,
  SAT,
}

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  darkMode: false,
  unit: Unit.SAT,
  walletLocked: false,
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  toggleDarkMode: () => {},
  setWalletLocked: () => {},
});

const AppContextProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();
  const { evtSource, setEvtSource } = useContext(SSEContext);

  const [unit, setUnit] = useState<Unit>(Unit.SAT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [walletLocked, setWalletLocked] = useState(false);
  const navigate = useNavigate();

  const toggleUnitHandler = () => {
    setUnit((prevUnit: Unit) => (prevUnit === Unit.SAT ? Unit.BTC : Unit.SAT));
  };

  const toggleDarkModeHandler = () => {
    setDarkMode((prevMode: boolean) => {
      const newMode = !prevMode;

      saveSettings({ darkMode: newMode });

      return newMode;
    });
  };

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("access_token");

    // close EventSource on logout
    if (evtSource) {
      evtSource.close();
      setEvtSource(null);
    }
    setIsLoggedIn(false);
    navigate("/");
  }, [evtSource, setEvtSource, navigate]);

  useEffect(() => {
    const settings = retrieveSettings();

    // check for settings in storage and set
    if (settings) {
      if (settings.darkMode) {
        setDarkMode(settings.darkMode);
      }

      if (settings.lang) {
        i18n.changeLanguage(settings.lang);
      }
    }

    // check for dark mode
    const documentEl = document.documentElement.classList;
    if (darkMode) {
      documentEl.add("dark");
    } else {
      documentEl.remove("dark");
    }

    // if authenticated log in automatically
    const token = localStorage.getItem("access_token");
    if (token) {
      const payload = parseJwt(token);
      if (payload.expires > Date.now()) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("access_token");
        console.info(`Token expired at ${payload.expires}.`);
      }
    }
  }, [darkMode, i18n]);

  const contextValue: AppContextType = {
    isLoggedIn,
    darkMode,
    unit,
    walletLocked,
    toggleUnit: toggleUnitHandler,
    setIsLoggedIn,
    logout: logoutHandler,
    toggleDarkMode: toggleDarkModeHandler,
    setWalletLocked,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
