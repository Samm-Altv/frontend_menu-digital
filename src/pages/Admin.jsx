import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminDishes from "@/components/admin/AdminDishes";
import AdminCategories from "@/components/admin/AdminCategories";
import styles from "@/styles/Admin.module.css";

export default function Admin() {
  const [seccionActiva, setSeccionActiva] = useState("pedidos");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.welcomeText}>
            Bienvenido, {user?.nombre || "Administrador"} ({user?.email})
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}
        >
          Cerrar Sesión
        </button>
      </header>

      <nav className={styles.tabs}>
        <button
          type="button"
          onClick={() => setSeccionActiva("pedidos")}
          className={`${styles.tabBtn} ${
            seccionActiva === "pedidos" ? styles.activeTab : ""
          }`}
        >
          Pedidos en Cocina
        </button>

        <button
          type="button"
          onClick={() => setSeccionActiva("platos")}
          className={`${styles.tabBtn} ${
            seccionActiva === "platos" ? styles.activeTab : ""
          }`}
        >
          Gestión de Platos
        </button>

        <button
          type="button"
          onClick={() => setSeccionActiva("categorias")}
          className={`${styles.tabBtn} ${
            seccionActiva === "categorias" ? styles.activeTab : ""
          }`}
        >
          Categorías
        </button>
      </nav>

      <section className={styles.panelContent}>
        {seccionActiva === "pedidos" && <AdminOrders />}
        {seccionActiva === "platos" && <AdminDishes />}
        {seccionActiva === "categorias" && <AdminCategories />}
      </section>
    </div>
  );
}
