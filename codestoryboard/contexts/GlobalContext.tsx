'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { TableType, PageType } from '../enums/_enums';

export interface Step {
  key: string;
  description?: string;
  code?: string;
  location?: string;
  state?: Record<string, any>;
  db?: any[];
  [key: string]: any; // Allow additional properties
}

interface DbTemplate {
  dbType: TableType;
  table_name: string;
  data: Record<string, Record<string, string>>;
}

interface GlobalState {
  isLoading: boolean;
  steps: Step[];
  editingStep: { index: number; step: Step } | null;
  dbTemplate: DbTemplate[];
  setDbTemplate: (dbTemplate: any[]) => void;
  page: PageType;
  setPage: (page: PageType) => void;
}

interface GlobalActions {
  setIsLoading: (loading: boolean) => void;
  setSteps: (steps: Step[]) => void;
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
  const [editingStep, setEditingStep] = useState<{ index: number; step: Step } | null>(null);
  const [dbTemplate, setDbTemplate] = useState<DbTemplate[]>([]);
  const [page, setPage] = useState<PageType>(PageType.BOARD);

  const value: GlobalContextType = {
    isLoading, setIsLoading,
    steps, setSteps,
    editingStep, setEditingStep,
    dbTemplate, setDbTemplate,
    page, setPage,
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
