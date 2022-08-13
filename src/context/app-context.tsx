import type { FC } from "react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ACCESS_TOKEN,
  disableGutter,
  parseJwt,
  retrieveSettings,
  saveSettings,
  setWindowAlias,
} from "../util";
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
  BTC = "BTC",
  SAT = "SAT",
}

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  darkMode: true,
  unit: Unit.SAT,
  walletLocked: false,
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  toggleDarkMode: () => {},
  setWalletLocked: () => {},
});

type Props = {
  children?: React.ReactNode;
};

const AppContextProvider: FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();
  const { evtSource, setEvtSource } = useContext(SSEContext);

  const [unit, setUnit] = useState<Unit>(Unit.SAT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
    localStorage.removeItem(ACCESS_TOKEN);

    // close EventSource on logout
    if (evtSource) {
      evtSource.close();
      setEvtSource(null);
    }
    setIsLoggedIn(false);
    disableGutter();
    setWindowAlias(null);
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
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const payload = parseJwt(token);
        if (payload.expires > Date.now()) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
          console.info(`Token expired at ${payload.expires}.`);
        }
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
        console.info(`Token invalid - removed.`);
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
