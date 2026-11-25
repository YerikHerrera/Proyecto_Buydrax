import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/globals.css";
import App from "./App.tsx";

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML = "<h1 style='font-family:sans-serif;padding:24px'>No existe #root en index.html</h1>";
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    rootEl.innerHTML = `<div style="padding:24px;font-family:system-ui"><h1 style="color:#b91c1c">Error al iniciar React</h1><pre>${msg}</pre></div>`;
    console.error(e);
  }
}
