import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { getGlobalStats, GlobalStats } from 'services/admin';

const GlobalContext = createContext<GlobalStats>({});

export const GlobalStatsProvider: FunctionComponent<{}> = ({ children }) => {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({});

  useEffect(() => {
    getGlobalStats().then(stats => setGlobalStats(stats));
  }, []);

  return (
    <GlobalContext.Provider value={{ ...globalStats }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStats = () => useContext(GlobalContext);
