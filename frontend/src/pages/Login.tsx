import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fondo from "../assets/login.jpg";
import logo from "../assets/logoo.png";
import Toast from "../components/ui/Toast";
import LoginDemo from "../components/login/LoginDemo";
import LoginForm from "../components/login/LoginForm";
import { useToast } from "../hooks/useToast";
import { login, loginDemo, loginGoogle, type RolDemo } from "../services/authService";

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
      // Navegación completa para evitar estados colgados del router
      window.location.assign("/dashboard");
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión";
      showToast(message);
      if (message.includes("No se pudo conectar") || message.includes("backend")) setShowDemo(true);
      setLoading(false);}
  };

  const handleGoogle = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    try {
      setLoading(true);
      if (clientId && (window as unknown as { google?: { accounts?: { id?: { initialize: Function; prompt: Function } } } }).google?.accounts?.id) {
        await new Promise<void>((resolve, reject) => {
          const g = (window as unknown as { google: { accounts: { id: { initialize: Function; prompt: Function } } } }).google;
          g.accounts.id.initialize({
            client_id: clientId,
            callback: async (resp: { credential?: string }) => {
              try {
                // Decodificar payload JWT de Google (solo claims públicos)
                const payload = resp.credential
                  ? JSON.parse(atob(resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
                  : null;
                const correo = payload?.email as string | undefined;
                if (!correo) throw new Error("Google no devolvió correo");
                await loginGoogle({
                  correo: correo.toLowerCase(),
                  nombres: payload?.given_name,
                  apellidos: payload?.family_name,
                  id_token: resp.credential,
                });
                showToast("Inicio de sesión con Google exitoso");
                window.location.assign("/dashboard");
                resolve();
              } catch (e) {
                reject(e);
              }
            },
          });
          g.accounts.id.prompt();
        });
        return;
      }
      // Fallback sin GIS configurado
      const correo = window.prompt("Correo de la cuenta Google registrada en Buydrax:");
      if (!correo) { setLoading(false); return; }
      await loginGoogle({ correo: correo.trim().toLowerCase() });
      showToast("Inicio de sesión con Google exitoso");
      window.location.assign("/dashboard");
      return;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "No se pudo iniciar con Google");
      setLoading(false);
    }
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
          onSubmit={handleLogin} onForgotPassword={() => navigate("/forgot-password")} onGoogle={handleGoogle}
        />

        <Link
          to="/soporte"
          style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none", marginTop: "16px", textAlign: "center" }}
        >
          ¿Problemas para ingresar? Contacta a soporte
        </Link>

        <LoginDemo visible={showDemo} onToggle={() => setShowDemo((v) => !v)} onSelectRole={entrarDemo} />
      </div>
    </div>
  );
}

export default Login;