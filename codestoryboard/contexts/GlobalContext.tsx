'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

interface Step {
  key: string;
  value: any; 
}

interface GlobalState {
  isLoading: boolean;
  steps: Step[];
  db: any;
  editingStep: { index: number; step: Step } | null;
}

interface GlobalActions {
  setIsLoading: (loading: boolean) => void;
  setSteps: (steps: Step[]) => void;
  setDb: (db: any) => void;
  setEditingStep: (editingStep: { index: number; step: Step } | null) => void;
}

interface GlobalContextType extends GlobalState, GlobalActions {}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [db, setDb] = useState<any>(null);
  const [editingStep, setEditingStep] = useState<{ index: number; step: Step } | null>(null);

  const value: GlobalContextType = {
    isLoading, setIsLoading,
    steps, setSteps,
    db, setDb,
    editingStep, setEditingStep,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook to use the global context
export function useGlobal() {
  const context = useContext(GlobalContext);
  
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  
  return context;
}

// Export the context for direct access if needed
export { GlobalContext };
