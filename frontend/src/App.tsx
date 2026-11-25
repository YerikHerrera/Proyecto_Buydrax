import { Component, type ErrorInfo, type ReactNode } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

type EBState = { error: Error | null };

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error de UI:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
          <h1 style={{ color: "#b91c1c" }}>Error en la interfaz</h1>
          <p>Copia este mensaje y envíalo al equipo:</p>
          <pre
            style={{
              background: "#fef2f2",
              padding: 12,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
              fontSize: 13,
            }}
          >
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              marginTop: 12,
              padding: "8px 14px",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Limpiar sesión e ir al login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
