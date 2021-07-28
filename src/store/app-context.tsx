import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

interface AppContextType {
  isLoggedIn: boolean;
  darkMode: boolean;
  unit: Unit;
  toggleUnit: () => void;
  toggleDarkMode: () => void;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
}

type Unit = 'BTC' | 'Sat';

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  darkMode: false,
  unit: 'BTC',
  toggleUnit: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
  toggleDarkMode: () => {},
  evtSource: null,
  setEvtSource: () => {}
});

const AppContextProvider: FC = (props) => {
  const [unit, setUnit] = useState<Unit>('BTC');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);

  const toggleUnitHandler = () => {
    setUnit((prevUnit) => (prevUnit === 'BTC' ? 'Sat' : 'BTC'));
  };

  const toggleDarkModeHandler = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const logoutHandler = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // check dark mode
    const documentEl = document.documentElement.classList;
    if (darkMode) {
      documentEl.add('dark');
    } else {
      documentEl.remove('dark');
    }

    // check authenticated
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, [darkMode]);

  const contextValue: AppContextType = {
    isLoggedIn,
    darkMode,
    unit,
    toggleUnit: toggleUnitHandler,
    setIsLoggedIn,
    logout: logoutHandler,
    toggleDarkMode: toggleDarkModeHandler,
    evtSource,
    setEvtSource
  };

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
