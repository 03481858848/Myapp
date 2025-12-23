import React, { createContext, ReactNode, useState } from 'react';

/* =======================
   Types & Interfaces
======================= */

interface ThemeContextType {
  dark: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

export const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleTheme: () => {},
});

/* =======================
   Provider
======================= */

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [dark, setDark] = useState<boolean>(false);

  const toggleTheme = (): void => {
    setDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
