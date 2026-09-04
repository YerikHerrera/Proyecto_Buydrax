import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/apiClient";

type Props = {
  children: React.ReactNode;
};

/**
 * Protege rutas: exige token JWT en localStorage.
 * Si no hay sesión, redirige al login conservando la ruta de destino.
 */
export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
