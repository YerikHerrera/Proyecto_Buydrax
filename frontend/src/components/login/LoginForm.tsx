import type { KeyboardEvent } from "react";

type Props = {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
};

export default function LoginForm({
  email, password, loading, onEmailChange, onPasswordChange, onSubmit, onForgotPassword,
}: Props) {
  const submitOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
    color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  return (
    <>
      <div style={{ width: "100%", marginBottom: "16px" }}>
        <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          CORREO ELECTRÓNICO
        </label>
        <input
          type="email" placeholder="correo@empresa.com" value={email}
          onChange={(e) => onEmailChange(e.target.value)} autoComplete="off"
          onKeyDown={submitOnEnter}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      </div>

      <div style={{ width: "100%", marginBottom: "20px" }}>
        <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          CONTRASEÑA
        </label>
        <input
          type="password" placeholder="••••••••" value={password}
          onChange={(e) => onPasswordChange(e.target.value)} autoComplete="new-password"
          onKeyDown={submitOnEnter}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      </div>

      <button
        onClick={onSubmit} disabled={loading}
        style={{
          width: "100%", padding: "14px", borderRadius: "10px", border: "none",
          background: loading ? "linear-gradient(135deg, #9a3412 0%, #c2410c 100%)" : "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
          color: "#fff", fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1,
          transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
          boxShadow: "0 8px 20px rgba(249, 115, 22, 0.35)",
        }}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <button
        type="button" onClick={onForgotPassword}
        style={{
          marginTop: "18px", background: "transparent", border: "none", color: "#fbbf24",
          fontSize: "13.5px", fontWeight: 600, cursor: "pointer", padding: "6px 8px",
          borderRadius: "6px", transition: "color 0.15s, background 0.15s",
        }}
      >
        ¿Olvidaste tu contraseña?
      </button>
    </>
  );
}
