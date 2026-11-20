import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import styles from "@/components/layout/Layout.module.css";

export default function Layout() {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto) {
    setCarrito((carritoActual) => {
      const yaExiste = carritoActual.find((item) => item.id === producto.id);

      if (yaExiste) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Menú
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Nosotros
            </NavLink>
          </div>

          <div className={styles.navGroup}>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Carrito ({totalItems})
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? `${styles.loginButton} ${styles.loginActive}`
                  : styles.loginButton
              }
            >
              Iniciar Sesión
            </NavLink>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {/* Aquí Layout mete la bandeja al túnel para que las páginas hijas la agarren */}
        <Outlet context={{ carrito, agregarAlCarrito, vaciarCarrito }} />
      </main>
    </div>
  );
}
