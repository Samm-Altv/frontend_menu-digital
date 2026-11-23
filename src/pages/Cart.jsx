import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "@/context/CartContext";
import { createOrder, getOrderStatus } from "@/services/orderService";
import styles from "@/styles/Cart.module.css";

export default function Cart() {
  const {
    items,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalPrecio,
  } = useCart();

  const [clienteNombre, setClienteNombre] = useState("");
  const [mesa, setMesa] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(() =>
    localStorage.getItem("pedido_activo_id"),
  );

  useEffect(() => {
    if (!pedidoIdGuardado) return;

    const consultarEstado = async () => {
      try {
        const data = await getOrderStatus(pedidoIdGuardado);
        setPedidoActivo(data);
      } catch {
        localStorage.removeItem("pedido_activo_id");
        setPedidoIdGuardado(null);
      }
    };

    consultarEstado();
    const intervalo = setInterval(consultarEstado, 5000);

    return () => clearInterval(intervalo);
  }, [pedidoIdGuardado]);

  const handleConfirmarPedido = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setEnviando(true);

      const payload = {
        cliente_nombre: clienteNombre,
        mesa: Number(mesa),
        notas,
        items: items.map((item) => ({
          plato_id: item.plato_id,
          cantidad: item.cantidad,
        })),
      };

      const nuevoPedido = await createOrder(payload);

      localStorage.setItem("pedido_activo_id", nuevoPedido.id);
      setPedidoIdGuardado(nuevoPedido.id);
      setPedidoActivo(nuevoPedido);
      vaciarCarrito();
      setClienteNombre("");
      setMesa("");
      setNotas("");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleNuevoPedido = () => {
    localStorage.removeItem("pedido_activo_id");
    setPedidoIdGuardado(null);
    setPedidoActivo(null);
  };

  if (pedidoActivo) {
    const detalles = pedidoActivo.detalle_pedido || pedidoActivo.items || [];

    return (
      <div className={styles.container}>
        <div className={styles.trackingCard}>
          <div className={styles.trackingHeader}>
            <div>
              <h1 className={styles.title} style={{ margin: 0 }}>
                Pedido #{pedidoActivo.id}
              </h1>
              <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                Mesa {pedidoActivo.mesa} · {pedidoActivo.cliente_nombre}
              </p>
            </div>

            <span
              className={`${styles.statusBadge} ${
                pedidoActivo.estado === "Listo"
                  ? styles.statusListo
                  : pedidoActivo.estado === "Entregado"
                    ? styles.statusEntregado
                    : ""
              }`}
            >
              {pedidoActivo.estado}
            </span>
          </div>

          <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
            Esta pantalla se actualiza automáticamente cada 5 segundos con el
            estado de cocina.
          </p>

          <ul className={styles.trackingList}>
            {detalles.map((det) => (
              <li key={det.id} className={styles.trackingItem}>
                <span>
                  {det.cantidad}x {det.nombre_plato}
                </span>
                <strong>
                  $
                  {(
                    Number(det.precio_unitario) * Number(det.cantidad)
                  ).toLocaleString("es-CO")}
                </strong>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span>${Number(pedidoActivo.total).toLocaleString("es-CO")}</span>
          </div>

          <button
            type="button"
            onClick={handleNuevoPedido}
            className={styles.newOrderBtn}
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Tu carrito está vacío</p>
          <Link to="/" className={styles.backLink}>
            Volver al menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tu Pedido</h1>

      <div className={styles.grid}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.plato_id} className={styles.itemCard}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.nombre}</h3>
                <p className={styles.itemPrice}>
                  ${item.precio.toLocaleString("es-CO")} c/u
                </p>
              </div>

              <div className={styles.quantityControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    actualizarCantidad(item.plato_id, item.cantidad - 1)
                  }
                >
                  -
                </button>
                <span className={styles.qtyValue}>{item.cantidad}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    actualizarCantidad(item.plato_id, item.cantidad + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => eliminarDelCarrito(item.plato_id)}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleConfirmarPedido} className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Datos de entrega</h2>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="clienteNombre" className={styles.label}>
              Tu nombre *
            </label>
            <input
              id="clienteNombre"
              type="text"
              required
              minLength={2}
              placeholder="Ej. Carlos Gómez"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mesa" className={styles.label}>
              Número de mesa (1 - 50) *
            </label>
            <input
              id="mesa"
              type="number"
              required
              min={1}
              max={50}
              placeholder="Ej. 4"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notas" className={styles.label}>
              Notas para cocina (opcional)
            </label>
            <textarea
              id="notas"
              rows={3}
              maxLength={200}
              placeholder="Ej. Sin cebolla, salsa aparte..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.totalRow}>
            <span>Total a pagar</span>
            <span>${totalPrecio.toLocaleString("es-CO")}</span>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className={styles.submitBtn}
          >
            {enviando ? "Enviando pedido..." : "Confirmar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
