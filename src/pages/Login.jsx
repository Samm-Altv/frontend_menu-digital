import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya tiene sesión iniciada, redirigir directo al panel
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setCargando(true);
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h1 className={styles.title}>Panel Administrador</h1>
        <p className={styles.subtitle}>
          Ingresa tus credenciales para gestionar el restaurante
        </p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="admin@restaurante.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={cargando} className={styles.submitBtn}>
          {cargando ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
