import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
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
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  const [unit, setUnit] = useState<Unit>('Sat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleUnitHandler = () => {
    setUnit((prevUnit) => (prevUnit === 'Sat' ? 'BTC' : 'Sat'));
  };

  const toggleDarkModeHandler = () => {
    setDarkMode((prevMode) => !prevMode);
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
    // check for dark mode
    const documentEl = document.documentElement.classList;
    if (darkMode) {
      documentEl.add('dark');
    } else {
      documentEl.remove('dark');
    }

    // check if authenticated
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
    toggleDarkMode: toggleDarkModeHandler
  };

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
