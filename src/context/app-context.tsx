import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  ACCESS_TOKEN,
  disableGutter,
  parseJwt,
  retrieveSettings,
  setWindowAlias,
} from "@/utils";
import { SSEContext } from "./sse-context";

export interface AppContextType {
  isLoggedIn: boolean;
  unit: Unit;
  walletLocked: boolean;
  isGeneratingReport: boolean;
  toggleUnit: () => void;
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
  unit: Unit.SAT,
  walletLocked: false,
  isGeneratingReport: false,
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  setWalletLocked: () => {},
  setIsGeneratingReport: () => {},
};

export const AppContext = createContext<AppContextType>(appContextDefault);

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { evtSource, setEvtSource } = useContext(SSEContext);

  const [unit, setUnit] = useState<Unit>(Unit.SAT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletLocked, setWalletLocked] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigate = useNavigate();

  const toggleUnitHandler = () => {
    setUnit((prevUnit: Unit) => (prevUnit === Unit.SAT ? Unit.BTC : Unit.SAT));
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
      if (settings.lang) {
        i18n.changeLanguage(settings.lang);
      }
    }

    // if authenticated log in automatically
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const payload = parseJwt(token);
        if (payload.expires > Date.now()) {
          setIsLoggedIn(true);
          if (
            window.location.pathname === "/" ||
            window.location.pathname === "/login"
          ) {
            navigate("/home");
          }
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
          console.info(`Token expired at ${payload.expires}.`);
        }
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
        console.info("Token invalid - removed");
      }
    }
  }, [i18n, navigate]);

  const contextValue: AppContextType = {
    isLoggedIn,
    unit,
    walletLocked,
    isGeneratingReport,
    toggleUnit: toggleUnitHandler,
    setIsLoggedIn,
    logout: logoutHandler,
    setWalletLocked,
    setIsGeneratingReport,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
