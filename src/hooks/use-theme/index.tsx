import React, { useState, useMemo, useContext, useCallback } from 'react';

interface Context {
  sunny: boolean;
  changeSunny: () => void;
}

const ThemeContext = React.createContext<Context>({} as any);

const useSunny = (initVal: boolean): [boolean, () => void] => {
  const [sunny, setSunny] = useState(initVal);
  const changeSunny = useCallback(() => {
    setSunny(!sunny);
  }, [sunny]);
  return [sunny, changeSunny];
};

export const ThemeProvider: React.FC = ({ children }) => {
  const [sunny, changeSunny] = useSunny(true);

  const value = useMemo(
    () => ({
      sunny,
      changeSunny,
    }),
    [sunny]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
