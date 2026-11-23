import { useState, useEffect } from "react";
import {
  getAdminDishes,
  getAdminCategories,
  createAdminDish,
  updateAdminDish,
  toggleAdminDishAvailability,
  deleteAdminDish,
} from "@/services/adminService";
import styles from "./AdminDishes.module.css";

export default function AdminDishes() {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setError(null);
      const [listaPlatos, listaCategorias] = await Promise.all([
        getAdminDishes(),
        getAdminCategories(),
      ]);
      setPlatos(listaPlatos);
      setCategorias(listaCategorias);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen("");
    setCategoriaId("");
    setDisponible(true);
    setEditandoId(null);
  };

  const handleSeleccionarEditar = (plato) => {
    setEditandoId(plato.id);
    setNombre(plato.nombre);
    setDescripcion(plato.descripcion || "");
    setPrecio(plato.precio);
    setImagen(plato.imagen || "");
    setCategoriaId(plato.categoria_id);
    setDisponible(plato.disponible);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setGuardando(true);
      const payload = {
        nombre,
        descripcion,
        precio: Number(precio),
        imagen,
        categoria_id: Number(categoriaId),
        disponible,
      };

      if (editandoId) {
        await updateAdminDish(editandoId, payload);
      } else {
        await createAdminDish(payload);
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleDisponibilidad = async (plato) => {
    try {
      setError(null);
      await toggleAdminDishAvailability(plato.id, !plato.disponible);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (plato) => {
    const confirmar = window.confirm(
      `¿Eliminar "${plato.nombre}" del menú? (Se conservará en el historial de pedidos)`,
    );
    if (!confirmar) return;

    try {
      setError(null);
      await deleteAdminDish(plato.id);
      if (editandoId === plato.id) limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const platosFiltrados = platos.filter(
    (p) =>
      filtroCategoria === "todas" || p.categoria_id === Number(filtroCategoria),
  );

  return (
    <div>
      {error && <div className={styles.errorBox}>{error}</div>}

      {/* Formulario Crear / Editar Plato */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.formTitle}>
          {editandoId ? "Editar Plato" : "Agregar Nuevo Plato"}
        </h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="dishNombre" className={styles.label}>
              Nombre del plato *
            </label>
            <input
              id="dishNombre"
              type="text"
              required
              placeholder="Ej. Bandeja Paisa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dishCategoria" className={styles.label}>
              Categoría *
            </label>
            <select
              id="dishCategoria"
              required
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecciona una categoría...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dishPrecio" className={styles.label}>
              Precio ($) *
            </label>
            <input
              id="dishPrecio"
              type="number"
              required
              min={1}
              step="any"
              placeholder="Ej. 25000"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dishImagen" className={styles.label}>
              URL de imagen (opcional)
            </label>
            <input
              id="dishImagen"
              type="url"
              placeholder="https://..."
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="dishDesc" className={styles.label}>
              Descripción
            </label>
            <input
              id="dishDesc"
              type="text"
              placeholder="Ingredientes o detalles del plato..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
          />
          Disponible para pedir inmediatamente
        </label>

        <div className={styles.buttonRow}>
          <button type="submit" disabled={guardando} className={styles.saveBtn}>
            {guardando
              ? "Guardando..."
              : editandoId
                ? "Actualizar Plato"
                : "Crear Plato"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className={styles.cancelBtn}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      {/* Filtro por categoría */}
      <div className={styles.filterRow}>
        <strong>Platos registrados ({platosFiltrados.length})</strong>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className={styles.select}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Platos */}
      <div className={styles.tableWrapper}>
        {cargando ? (
          <p>Cargando platos...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Plato</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado (Clic para cambiar)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platosFiltrados.map((plato) => (
                <tr key={plato.id}>
                  <td>
                    <img
                      src={
                        plato.imagen ||
                        "https://via.placeholder.com/80?text=Plato"
                      }
                      alt={plato.nombre}
                      className={styles.dishThumb}
                    />
                  </td>
                  <td>
                    <strong>{plato.nombre}</strong>
                    {plato.descripcion && (
                      <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                        {plato.descripcion}
                      </div>
                    )}
                  </td>
                  <td>{plato.categoria?.nombre || "Sin categoría"}</td>
                  <td>
                    <strong>
                      ${Number(plato.precio).toLocaleString("es-CO")}
                    </strong>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleDisponibilidad(plato)}
                      className={`${styles.toggleBtn} ${
                        plato.disponible
                          ? styles.availableBtn
                          : styles.unavailableBtn
                      }`}
                    >
                      {plato.disponible ? "✓ Disponible" : "✕ Agotado"}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        onClick={() => handleSeleccionarEditar(plato)}
                        className={styles.editBtn}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(plato)}
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
  );
}
