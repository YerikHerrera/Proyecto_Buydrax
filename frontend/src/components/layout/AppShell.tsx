import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  /** clase extra para el main (opcional) */
  mainClassName?: string;
};

/**
 * Layout estándar de todas las pantallas autenticadas:
 * Navbar arriba + sidebar fija + contenido con scroll.
 */
export default function AppShell({ children, mainClassName = "" }: Props) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-shell__body">
        <Sidebar />
        <main className={`app-shell__main ${mainClassName}`.trim()}>
          {children}
        </main>
      </div>
    </div>
  );
}
