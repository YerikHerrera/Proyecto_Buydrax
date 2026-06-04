import { useNavigate } from "react-router-dom";
import fondo from "../assets/login.jpg";
import logo from "../assets/logoo.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("usuario", JSON.stringify({
      nombre: "Juan Pérez",
      cargo: "Administrador",
      email: "juan@buydrax.com"
    }));
    navigate("/dashboard");
  };

  return (
    <div style={{
      backgroundImage: `url(${fondo})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* OVERLAY OSCURO */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
      }} />

      {/* CARD */}
      <div style={{
        position: "relative",
        zIndex: 1,
        background: "rgba(10, 12, 24, 0.85)",
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
      }}>

        {/* LOGO */}
        <img
          src={logo}
          alt="Buydrax"
          style={{ width: "130px", marginBottom: "8px" }}
        />

        {/* TÍTULOS */}
        <h1 style={{
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 0 4px",
        }}>
          Bienvenido a Buydrax
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "13px",
          marginBottom: "32px",
        }}>
          Ingresa tus credenciales para continuar
        </p>

        {/* INPUTS */}
        <div style={{ width: "100%", marginBottom: "16px" }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            CORREO ELECTRÓNICO
          </label>
          <input
            type="email"
            placeholder="correo@empresa.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            CONTRASEÑA
          </label>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* OLVIDASTE CONTRASEÑA */}
        <div style={{ width: "100%", textAlign: "right", marginBottom: "28px" }}>
          <span
            onClick={() => navigate("/forgot-password")}
            style={{
              color: "#2600ff",
              fontSize: "12.5px",
              cursor: "pointer",
              textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        {/* BOTÓN */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #000000 0%, #0011ff 100%)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Ingresar
        </button>

      </div>
    </div>
  );
}

export default Login;