import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/login.jpg";
import logo from "../assets/logoo.png";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { login, loginDemo, type RolDemo } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { toast, showToast } = useToast();

  const handleLogin = async () => {
    const emailLimpio = email.trim();
    const passwordLimpio = password.trim();

    if (!emailLimpio || !passwordLimpio) {
      showToast("Correo electrónico y contraseña son campos obligatorios");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio);
    if (!emailValido) {
      showToast("Ingresa un correo electrónico válido");
      return;
    }

    try {
      setLoading(true);
      await login(emailLimpio, passwordLimpio);
      showToast("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión";
      showToast(message);
      // Si falla por backend apagado, ofrecer demo
      if (message.includes("No se pudo conectar") || message.includes("backend")) {
        setShowDemo(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const entrarDemo = (rol: RolDemo) => {
    loginDemo(rol);
    showToast(`Modo demo · ${rol}`);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(10, 12, 24, 0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "48px 44px",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
        }}
      >
        <img src={logo} alt="Buydrax" style={{ width: "130px", marginBottom: "8px" }} />

        <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>
          Bienvenido a Buydrax
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          Gestión de personal y operaciones · Construcción
        </p>

        <div style={{ width: "100%", marginBottom: "16px" }}>
          <label
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "12px",
              letterSpacing: "0.5px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            CORREO ELECTRÓNICO
          </label>
          <input
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "12px",
              letterSpacing: "0.5px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            CONTRASEÑA
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: loading
              ? "linear-gradient(135deg, #9a3412 0%, #c2410c 100%)"
              : "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
            transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
            boxShadow: "0 8px 20px rgba(249, 115, 22, 0.35)",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          style={{
            marginTop: "18px",
            background: "transparent",
            border: "none",
            color: "#fbbf24",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            padding: "6px 8px",
            borderRadius: "6px",
            transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fde68a";
            e.currentTarget.style.background = "rgba(251, 191, 36, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#fbbf24";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>

        {/* Modo demo para navegar sin backend */}
        <div
          style={{
            width: "100%",
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px dashed rgba(251, 191, 36, 0.45)",
              color: "#fbbf24",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {showDemo ? "Ocultar acceso demo" : "Entrar en modo demo (sin backend)"}
          </button>

          {showDemo && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11,
                  margin: 0,
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                El backend no es necesario. Elige un rol para recorrer las interfaces.
                Los datos de reportes son de vista previa.
              </p>
              {(
                [
                  ["ADMIN_RRHH", "Admin RRHH — acceso completo"],
                  ["SUPERVISOR", "Supervisor"],
                  ["CONTADOR", "Contador"],
                  ["EMPLEADO", "Empleado (portal)"],
                ] as [RolDemo, string][]
              ).map(([rol, label]) => (
                <button
                  key={rol}
                  type="button"
                  onClick={() => entrarDemo(rol)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background:
                      rol === "ADMIN_RRHH"
                        ? "linear-gradient(135deg, rgba(180,83,9,0.35), rgba(245,158,11,0.25))"
                        : "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
