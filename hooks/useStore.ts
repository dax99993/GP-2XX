import { Store } from "@/models/store";
import { createContext, useContext } from "react";

export interface StoreContextType {
    store: Store;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreContext Provider');
  }

  return context.store;
}