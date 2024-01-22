import {
  ACCESS_TOKEN,
  disableGutter,
  parseJwt,
  retrieveSettings,
  saveSettings,
  setWindowAlias,
} from "@/utils";
import type { FC, PropsWithChildren } from "react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SSEContext } from "./sse-context";

export interface AppContextType {
  isLoggedIn: boolean;
  darkMode: boolean;
  unit: Unit;
  walletLocked: boolean;
  isGeneratingReport: boolean;
  toggleUnit: () => void;
  toggleDarkMode: () => void;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  setWalletLocked: Dispatch<SetStateAction<boolean>>;
  setIsGeneratingReport: Dispatch<SetStateAction<boolean>>;
}

export enum Unit {
  BTC = "BTC",
  SAT = "SAT",
}

export const appContextDefault: AppContextType = {
  isLoggedIn: false,
  darkMode: true,
  unit: Unit.SAT,
  walletLocked: false,
  isGeneratingReport: false,
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  toggleDarkMode: () => {},
  setWalletLocked: () => {},
  setIsGeneratingReport: () => {},
};

export const AppContext = createContext<AppContextType>(appContextDefault);

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { evtSource, setEvtSource } = useContext(SSEContext);

  const [unit, setUnit] = useState<Unit>(Unit.SAT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [walletLocked, setWalletLocked] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
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
    toast.dismiss();
    navigate("/");
  }, [evtSource, setEvtSource, navigate]);

  useEffect(() => {
    const settings = retrieveSettings();

    // check for settings in storage and set
    if (settings) {
      if (settings.darkMode) {
        setDarkMode(settings.darkMode);
      }

      const setLanguage = async () => {
        if (settings.lang) {
          await i18n.changeLanguage(settings.lang);
        }
      };

      setLanguage();
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
    isGeneratingReport,
    toggleUnit: toggleUnitHandler,
    setIsLoggedIn,
    logout: logoutHandler,
    toggleDarkMode: toggleDarkModeHandler,
    setWalletLocked,
    setIsGeneratingReport,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
