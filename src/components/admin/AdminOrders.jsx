import { useState, useEffect, useCallback } from "react";
import {
  getAdminOrders,
  updateAdminOrderStatus,
  getTodayStats,
} from "@/services/adminService";
import styles from "./AdminOrders.module.css";

const SIGUIENTE_ESTADO = {
  Pendiente: {
    siguiente: "En preparación",
    textoBoton: "Iniciar Preparación",
  },
  "En preparación": {
    siguiente: "Listo",
    textoBoton: "Marcar como Listo",
  },
  Listo: {
    siguiente: "Entregado",
    textoBoton: "Marcar como Entregado",
  },
};

const FILTROS = [
  "Activos",
  "Pendiente",
  "En preparación",
  "Listo",
  "Entregado",
];

export default function AdminOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({
    total_ventas: 0,
    pedidos_entregados: 0,
  });
  const [filtroEstado, setFiltroEstado] = useState("Activos");
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const [listaPedidos, estadisticasHoy] = await Promise.all([
        getAdminOrders(filtroEstado),
        getTodayStats(),
      ]);
      setPedidos(listaPedidos);
      setStats(estadisticasHoy);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    setCargando(true);
    cargarDatos();

    // Actualizar tablero automáticamente cada 8 segundos
    const intervalo = setInterval(cargarDatos, 8000);
    return () => clearInterval(intervalo);
  }, [cargarDatos]);

  const handleAvanzarEstado = async (pedidoId, nuevoEstado) => {
    try {
      setProcesandoId(pedidoId);
      setError(null);
      await updateAdminOrderStatus(pedidoId, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  };

  const getBadgeClass = (estado) => {
    if (estado === "Pendiente") return styles.badgePendiente;
    if (estado === "En preparación") return styles.badgePreparacion;
    if (estado === "Listo") return styles.badgeListo;
    return styles.badgeEntregado;
  };

  return (
    <div>
      {/* Tarjetas de resumen del día */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Ventas Entregadas Hoy</span>
          <span className={`${styles.statValue} ${styles.statValueGreen}`}>
            ${Number(stats.total_ventas).toLocaleString("es-CO")}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pedidos Entregados Hoy</span>
          <span className={styles.statValue}>{stats.pedidos_entregados}</span>
        </div>
      </div>

      {/* Barra de filtros por estado */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              type="button"
              onClick={() => setFiltroEstado(filtro)}
              className={`${styles.filterBtn} ${
                filtroEstado === filtro ? styles.activeFilter : ""
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={cargarDatos}
          className={styles.refreshBtn}
        >
          ↻ Actualizar
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {cargando ? (
        <p className={styles.emptyText}>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className={styles.emptyText}>
          No hay pedidos en la categoría "{filtroEstado}".
        </p>
      ) : (
        <div className={styles.ordersGrid}>
          {pedidos.map((pedido) => {
            const accion = SIGUIENTE_ESTADO[pedido.estado];

            return (
              <article key={pedido.id} className={styles.orderCard}>
                <div>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3 className={styles.orderTitle}>
                        Pedido #{pedido.id} · Mesa {pedido.mesa}
                      </h3>
                      <p className={styles.orderMeta}>
                        {pedido.cliente_nombre} ·{" "}
                        {new Date(pedido.fecha).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <span
                      className={`${styles.badge} ${getBadgeClass(
                        pedido.estado,
                      )}`}
                    >
                      {pedido.estado}
                    </span>
                  </div>

                  {pedido.notas && (
                    <div className={styles.notesBox}>
                      <strong>Nota:</strong> {pedido.notas}
                    </div>
                  )}

                  <ul className={styles.itemsList}>
                    {(pedido.detalle_pedido || []).map((item) => (
                      <li key={item.id} className={styles.itemRow}>
                        <span>
                          <strong>{item.cantidad}x</strong> {item.nombre_plato}
                        </span>
                        <span>
                          $
                          {(
                            Number(item.precio_unitario) * Number(item.cantidad)
                          ).toLocaleString("es-CO")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>${Number(pedido.total).toLocaleString("es-CO")}</span>
                  </div>

                  {accion && (
                    <button
                      type="button"
                      disabled={procesandoId === pedido.id}
                      onClick={() =>
                        handleAvanzarEstado(pedido.id, accion.siguiente)
                      }
                      className={`${styles.actionBtn} ${
                        pedido.estado === "Listo" ? styles.actionBtnReady : ""
                      }`}
                    >
                      {procesandoId === pedido.id
                        ? "Actualizando..."
                        : accion.textoBoton}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
