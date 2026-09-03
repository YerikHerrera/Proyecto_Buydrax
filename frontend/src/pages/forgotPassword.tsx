import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logobuydrax.png";
import "../styles/ForgotPassword.css";

type EstadoEnvio = "idle" | "enviando" | "enviado" | "error";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<EstadoEnvio>("idle");
  const [error, setError] = useState("");

  const validarEmail = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Ingresa tu correo electrónico");
      return;
    }
    if (!validarEmail(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    setEstado("enviando");

    try {
      // ─────────────────────────────────────────────────────────────
      // TODO (backend): reemplazar esta simulación por la llamada real, ej:
      //
      // const res = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // if (!res.ok) throw new Error("No se pudo procesar la solicitud");
      //
      // El backend debe: 1) verificar si el correo existe en la BD de usuarios,
      // 2) generar un token de recuperación con expiración,
      // 3) enviar el correo con el enlace (ej. /reset-password?token=...).
      // ─────────────────────────────────────────────────────────────
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simula latencia de red

      setEstado("enviado");
    } catch {
      setEstado("error");
      setError("Ocurrió un error al procesar tu solicitud. Intenta de nuevo.");
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-logo-wrapper">
          <img src={logo} alt="Buydrax" className="fp-logo" />
        </div>

        {estado !== "enviado" ? (
          <>
            <h1 className="fp-title">Recuperar contraseña</h1>
            <p className="fp-subtitle">
              Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email" className="fp-label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className={`fp-input ${error ? "fp-input--error" : ""}`}
                placeholder="correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={estado === "enviando"}
              />
              {error && <span className="fp-error">{error}</span>}

              <button type="submit" className="fp-btn" disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando..." : "Enviar instrucciones"}
              </button>
            </form>
          </>
        ) : (
          <div className="fp-exito">
            <div className="fp-exito-icono">
              <i className="bi bi-envelope-check-fill"></i>
            </div>
            <h1 className="fp-title">Revisa tu correo</h1>
            <p className="fp-subtitle">
              Si <strong>{email}</strong> está registrado en Buydrax, recibirás un enlace para
              restablecer tu contraseña en unos minutos.
            </p>
          </div>
        )}

        <Link to="/" className="fp-volver">
          <i className="bi bi-arrow-left"></i> Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}