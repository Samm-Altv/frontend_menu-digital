import { useOutletContext } from "react-router";
import styles from "@/styles/Cart.module.css";

export default function Cart() {
  const { carrito = [], vaciarCarrito } = useOutletContext() || {};

  const totalPagar = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Tu Carrito de Comidas</h1>

      {carrito.length === 0 ? (
        <p className={styles.empty}>
          Aún no has agregado ningún plato del menú.
        </p>
      ) : (
        <>
          <div className={styles.list}>
            {carrito.map((item) => (
              <div key={item.id} className={styles.item}>
                <div>
                  <span className={styles.itemName}>{item.nombre}</span>
                  <span className={styles.itemQuantity}>x{item.cantidad}</span>
                </div>
                <span className={styles.itemPrice}>
                  ${(item.precio * item.cantidad).toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <button
              type="button"
              onClick={vaciarCarrito}
              className={styles.clearButton}
            >
              Vaciar carrito
            </button>
            <span className={styles.total}>
              Total: ${totalPagar.toLocaleString("es-CO")}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
