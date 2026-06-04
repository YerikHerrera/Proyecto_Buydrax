import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <div className="login-card">
        <h1>Bienvenido</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
        />

        <input
          type="password"
          placeholder="Contraseña"
        />

        <Button
          text="Ingresar"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
}

export default Login;
