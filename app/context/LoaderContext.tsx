import React, { createContext, ReactNode, useState } from 'react';

/* =======================
   Types & Interfaces
======================= */

interface LoaderContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoaderProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

export const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  setLoading: () => {},
});



export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
