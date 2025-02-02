// context/ErrorContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ErrorContextProps {
  setError: (message: string) => void;
  clearError: () => void;
  error: string | null;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (message: string) => setErrorState(message);
  const clearError = () => setErrorState(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
