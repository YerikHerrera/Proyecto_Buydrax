import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<Ctx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        abierto,
        setAbierto,
        toggle: () => setAbierto((v) => !v),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    // Fallback seguro si se usa fuera del provider
    return {
      abierto: false,
      setAbierto: (_: boolean) => {},
      toggle: () => {},
    };
  }
  return ctx;
}
