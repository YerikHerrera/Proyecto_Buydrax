import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logobuydrax.png";
import { SOPORTE } from "../config/soporte";
import "../styles/forgotPassword.css";
import "../styles/Soporte.css";

type Estado = "idle" | "enviado";

const validarEmail = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

export default function Soporte() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tipo, setTipo] = useState("Error en el sistema");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      setError("Completa todos los campos");
      return;
    }
    if (!validarEmail(correo)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    const asunto = encodeURIComponent(`[Buydrax] ${tipo}`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\nTipo: ${tipo}\n\n${mensaje}`
    );
    window.location.href = `mailto:${SOPORTE.correo}?subject=${asunto}&body=${cuerpo}`;
    setEstado("enviado");
  };

  return (

    
    <div className="fp-page">
      <div className="fp-card" style={{ position: "relative", paddingTop: 64 }}>
        <img
          src={logo}
          alt="Buydrax"
         style={{ position: "absolute", top: 18, left: 20, width: 100, height: "auto", margin: 0, }}
        />

        <h1 className="fp-title">Soporte</h1>
        <p className="fp-subtitle">¿Encontraste un error? Escríbenos y te ayudamos.</p>

        <div className="sp-info">
          <p>
            <i className="bi bi-person"></i> {SOPORTE.nombre} · {SOPORTE.cargo}
          </p>
          <p>
            <i className="bi bi-envelope"></i> {SOPORTE.correo}
          </p>
          {SOPORTE.telefono && (
            <p>
              <i className="bi bi-telephone"></i> {SOPORTE.telefono}
            </p>
          )}
          <p>
            <i className="bi bi-clock"></i> {SOPORTE.horario}
          </p>
        </div>

        {estado !== "enviado" ? (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="sp-nombre" className="fp-label">Nombre*</label>
            <input
              id="sp-nombre"
              className="fp-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label htmlFor="sp-correo" className="fp-label">Correo electrónico*</label>
            <input
              id="sp-correo"
              type="email"
              className="fp-input"
              placeholder="correo@empresa.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <label htmlFor="sp-tipo" className="fp-label">Tipo de problema*</label>
            <select
              id="sp-tipo"
              className="fp-input"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option>Error en el sistema</option>
              <option>No puedo iniciar sesión</option>
              <option>Problema con mis datos</option>
              <option>Otro</option>
            </select>

            <label htmlFor="sp-mensaje" className="fp-label">Descripción del problema*</label>
            <textarea
              id="sp-mensaje"
              rows={4}
              className="fp-input sp-textarea"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />

            {error && <span className="fp-error">{error}</span>}

            <button type="submit" className="fp-btn">Enviar solicitud de soporte</button>
          </form>
        ) : (
          <div className="fp-exito">
            <div className="fp-exito-icono">
              <i className="bi bi-envelope-check-fill"></i>
            </div>
            <h2 className="fp-title">Revisa tu programa de correo</h2>
            <p className="fp-subtitle">
              Abrimos tu correo con el mensaje listo. Si no se abrió, escríbenos
              directamente a <strong>{SOPORTE.correo}</strong>.
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