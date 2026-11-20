import { useState } from "react";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  function manejarEnvio(evento) {
    evento.preventDefault();
    alert(`Intentando iniciar sesión con: ${correo}`);
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <p className={styles.subtitle}>
        Ingresa tus datos para gestionar tus pedidos
      </p>

      <form onSubmit={manejarEnvio} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Correo electrónico</label>
          <input
            type="email"
            className={styles.input}
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </section>
  );
}
