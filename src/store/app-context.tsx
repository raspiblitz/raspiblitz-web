import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

interface AppContextType {
  authenticated: boolean;
  darkMode: boolean;
  unit: Unit;
  toggleUnit: () => void;
  toggleDarkMode: () => void;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
}

type Unit = 'BTC' | 'Sat';

export const AppContext = createContext<AppContextType>({
  authenticated: false,
  darkMode: false,
  unit: 'BTC',
  toggleUnit: () => {},
  setAuthenticated: () => {},
  toggleDarkMode: () => {},
  evtSource: null,
  setEvtSource: () => {}
});

const AppContextProvider: FC = (props) => {
  const [unit, setUnit] = useState<Unit>('BTC');
  const [authenticated, setAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);

  const toggleUnitHandler = () => {
    setUnit((prevUnit) => (prevUnit === 'BTC' ? 'Sat' : 'BTC'));
  };

  const toggleDarkModeHandler = () => {
    setDarkMode((prevMode) => !prevMode);
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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAuthenticated(false);
    }
  }, [darkMode]);

  const contextValue: AppContextType = {
    authenticated,
    darkMode,
    unit,
    toggleUnit: toggleUnitHandler,
    setAuthenticated,
    toggleDarkMode: toggleDarkModeHandler,
    evtSource,
    setEvtSource
  };

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
