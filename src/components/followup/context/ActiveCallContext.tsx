
import { createContext, useContext, useState, ReactNode } from "react";
import { useActiveCall } from "../hooks/useActiveCall";

type ActiveCallContextType = ReturnType<typeof useActiveCall>;

const ActiveCallContext = createContext<ActiveCallContextType | undefined>(undefined);

export const ActiveCallProvider = ({ children }: { children: ReactNode }) => {
  const activeCallHook = useActiveCall();
  
  return (
    <ActiveCallContext.Provider value={activeCallHook}>
      {children}
    </ActiveCallContext.Provider>
  );
};

export const useActiveCallContext = () => {
  const context = useContext(ActiveCallContext);
  if (context === undefined) {
    throw new Error('useActiveCallContext must be used within an ActiveCallProvider');
  }
  return context;
};
