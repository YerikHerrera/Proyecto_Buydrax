import type { FormEvent } from "react"
import {useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logobuydrax.png";
import { resetPassword } from "../services/authService";
import "../styles/forgotPassword.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const tokenFromUrl = useMemo(() => params.get("token") || "", [params]);
  const navigate = useNavigate();
  const [token, setToken] = useState(tokenFromUrl);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!token.trim()) {
      setError("Falta el token de recuperación");
      return;
    }
    if (pass1.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (pass1 !== pass2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token.trim(), pass1);
      setMsg(res.message || "Contraseña actualizada");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo restablecer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-logo-wrapper">
          <img src={logo} alt="Buydrax" className="fp-logo" />
        </div>
        <h1 className="fp-title">Nueva contraseña</h1>
        <p className="fp-subtitle">Pega el token del correo y define tu nueva clave.</p>
        <form onSubmit={onSubmit} noValidate>
          <label className="fp-label">Token</label>
          <input
            className={`fp-input ${error && !token ? "fp-input--error" : ""}`}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <label className="fp-label">Nueva contraseña</label>
          <input
            type="password"
            className="fp-input"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            disabled={loading}
          />
          <label className="fp-label">Confirmar contraseña</label>
          <input
            type="password"
            className="fp-input"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            disabled={loading}
          />
          {error && <p className="fp-error">{error}</p>}
          {msg && <p className="fp-success">{msg}</p>}
          <button type="submit" className="fp-submit" disabled={loading}>
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
        <p className="fp-back">
          <Link to="/">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
