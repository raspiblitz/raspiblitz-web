import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { retrieveSettings, saveSettings } from '../util/util';
import { SSEContext } from './sse-context';

interface AppContextType {
  isLoggedIn: boolean;
  darkMode: boolean;
  unit: Unit;
  toggleUnit: () => void;
  toggleDarkMode: () => void;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

type Unit = 'BTC' | 'Sat';

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  darkMode: false,
  unit: 'Sat',
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  toggleDarkMode: () => {}
});

const AppContextProvider: FC = (props) => {
  const { i18n } = useTranslation();
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  const [unit, setUnit] = useState<Unit>('Sat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleUnitHandler = () => {
    setUnit((prevUnit: Unit) => (prevUnit === 'Sat' ? 'BTC' : 'Sat'));
  };

  const toggleDarkModeHandler = () => {
    setDarkMode((prevMode: boolean) => {
      const newMode = !prevMode;

      saveSettings({ darkMode: newMode });

      return newMode;
    });
  };

  const logoutHandler = () => {
    localStorage.removeItem('access_token');

    // close EventSource on logout
    if (evtSource) {
      evtSource.close();
      setEvtSource(null);
    }
    setIsLoggedIn(false);
  };

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
      documentEl.add('dark');
    } else {
      documentEl.remove('dark');
    }

    // if authenticated log in automatically
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, [darkMode, i18n]);

  const contextValue: AppContextType = {
    isLoggedIn,
    darkMode,
    unit,
    toggleUnit: toggleUnitHandler,
    setIsLoggedIn,
    logout: logoutHandler,
    toggleDarkMode: toggleDarkModeHandler
  };

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
