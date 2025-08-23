import { createContext, ReactNode, useContext, useState } from "react";

export interface ScrollingContextType {
  isScrollingEnabled: boolean;
  enableScrolling: () => void;
  disableScrolling: () => void;
}

// Create the context with a default value (can be undefined if handled in provider)
const ScrollingContext = createContext<ScrollingContextType | undefined>(undefined);

// Custom hook to consume the context
export const useScrolling = () => {
  const context = useContext(ScrollingContext);
  if (context === undefined) {
    throw new Error('useScrolling must be used within a ScrollingProvider');
  }
  return context;
};

// Provider component
interface ScrollingProviderProps {
  children: ReactNode;
}

export const ScrollingProvider: React.FC<ScrollingProviderProps> = ({ children }) => {
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(true);

  const enableScrolling = () => {
    setIsScrollingEnabled(true);
  };

  const disableScrolling = () => {
    setIsScrollingEnabled(false);
  };

  const contextValue: ScrollingContextType = {
    isScrollingEnabled,
    enableScrolling,
    disableScrolling
  };

  return (
    <ScrollingContext.Provider value={contextValue}>
      {children}
    </ScrollingContext.Provider>
  );
};