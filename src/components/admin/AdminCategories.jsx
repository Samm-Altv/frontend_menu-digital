import { useState, useEffect } from "react";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/services/adminService";
import styles from "./AdminCategories.module.css";

export default function AdminCategories() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState(0);
  const [editandoId, setEditandoId] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCategorias = async () => {
    try {
      setError(null);
      const data = await getAdminCategories();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setOrden(0);
    setEditandoId(null);
  };

  const handleSeleccionarEditar = (categoria) => {
    setEditandoId(categoria.id);
    setNombre(categoria.nombre);
    setOrden(categoria.orden ?? 0);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setGuardando(true);
      const payload = { nombre, orden: Number(orden) };

      if (editandoId) {
        await updateAdminCategory(editandoId, payload);
      } else {
        await createAdminCategory(payload);
      }

      limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (categoria) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${categoria.nombre}"?`,
    );
    if (!confirmar) return;

    try {
      setError(null);
      await deleteAdminCategory(categoria.id);
      if (editandoId === categoria.id) limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.wrapper}>
        {/* Formulario Crear / Editar */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2 className={styles.formTitle}>
            {editandoId ? "Editar Categoría" : "Nueva Categoría"}
          </h2>

          <div className={styles.formGroup}>
            <label htmlFor="catNombre" className={styles.label}>
              Nombre *
            </label>
            <input
              id="catNombre"
              type="text"
              required
              placeholder="Ej. Bebidas Frías"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="catOrden" className={styles.label}>
              Orden de aparición
            </label>
            <input
              id="catOrden"
              type="number"
              min={0}
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              type="submit"
              disabled={guardando}
              className={styles.saveBtn}
            >
              {guardando
                ? "Guardando..."
                : editandoId
                  ? "Guardar Cambios"
                  : "Crear Categoría"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Tabla de Categorías */}
        <div className={styles.tableWrapper}>
          {cargando ? (
            <p>Cargando categorías...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Nombre</th>
                  <th>Platos activos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.orden}</td>
                    <td>
                      <strong>{cat.nombre}</strong>
                    </td>
                    <td>
                      <span className={styles.countBadge}>
                        {cat.cantidad_platos ?? 0} platos
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          type="button"
                          onClick={() => handleSeleccionarEditar(cat)}
                          className={styles.editBtn}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(cat)}
                          className={styles.deleteBtn}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
