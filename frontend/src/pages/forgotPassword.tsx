import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logobuydrax.png";
import "../styles/forgotPassword.css";

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
      const { forgotPassword } = await import("../services/authService");
      await forgotPassword(email.trim().toLowerCase());
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