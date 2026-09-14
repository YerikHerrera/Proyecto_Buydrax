import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/login.jpg";
import logo from "../assets/logoo.png";
import Toast from "../components/ui/Toast";
import LoginDemo from "../components/login/LoginDemo";
import LoginForm from "../components/login/LoginForm";
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
    if (!emailLimpio || !passwordLimpio) { showToast("Correo electrónico y contraseña son campos obligatorios"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) { showToast("Ingresa un correo electrónico válido"); return; }

    try {
      setLoading(true);
      await login(emailLimpio, passwordLimpio);
      showToast("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión";
      showToast(message);
      if (message.includes("No se pudo conectar") || message.includes("backend")) setShowDemo(true);
    } finally { setLoading(false); }
  };

  const entrarDemo = (rol: RolDemo) => {
    loginDemo(rol);
    showToast(`Modo demo · ${rol}`);
    navigate("/dashboard");
  };

  return (
    <div style={{ backgroundImage: `url(${fondo})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)" }} />
      <div style={{ position: "relative", zIndex: 1, background: "rgba(10, 12, 24, 0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "48px 44px", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0px", boxShadow: "0 24px 48px rgba(0,0,0,0.35)" }}>
        <img src={logo} alt="Buydrax" style={{ width: "130px", marginBottom: "8px" }} />
        <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>Bienvenido a Buydrax</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "28px", textAlign: "center" }}>
          Gestión de personal y operaciones · Construcción
        </p>

        <LoginForm
          email={email} password={password} loading={loading}
          onEmailChange={setEmail} onPasswordChange={setPassword}
          onSubmit={handleLogin} onForgotPassword={() => navigate("/forgot-password")}
        />
        <LoginDemo visible={showDemo} onToggle={() => setShowDemo((v) => !v)} onSelectRole={entrarDemo} />
      </div>
    </div>
  );
}

export default Login;
