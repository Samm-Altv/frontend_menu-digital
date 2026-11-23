import { Outlet, NavLink } from "react-router";
import { useCart } from "@/context/CartContext";
import styles from "./Layout.module.css";

export default function Layout() {
  const { totalItems } = useCart();

  return (
    <div>
      <header className={styles.navbar}>
        <nav className={styles.navContainer}>
          <div className={styles.navLeft}>
            <NavLink to="/" className={styles.navItem}>
              Menú
            </NavLink>

            <NavLink to="/about" className={styles.navItem}>
              Nosotros
            </NavLink>
          </div>

          <div className={styles.navRight}>
            <NavLink to="/cart" className={styles.cartItem}>
              Carrito
              {totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </NavLink>

            <NavLink to="/admin" className={styles.adminItem}>
              Admin
            </NavLink>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
