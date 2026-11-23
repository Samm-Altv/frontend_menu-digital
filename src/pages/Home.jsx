import { useState, useEffect } from "react";
import { getPublicMenu } from "../services/menuService";
import { useCart } from "../context/CartContext";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [agregadoId, setAgregadoId] = useState(null);

  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        setCargando(true);
        const data = await getPublicMenu();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarMenu();
  }, []);

  const handleAgregar = (plato) => {
    agregarAlCarrito(plato);
    setAgregadoId(plato.id);
    setTimeout(() => {
      setAgregadoId(null);
    }, 1000);
  };

  if (cargando) {
    return <p className={styles.statusMessage}>Cargando nuestro menú...</p>;
  }

  if (error) {
    return <p className={styles.statusMessage}>Error: {error}</p>;
  }

  const categoriasFiltradas = categorias
    .filter(
      (cat) =>
        categoriaSeleccionada === "todas" ||
        cat.id === Number(categoriaSeleccionada),
    )
    .map((cat) => {
      const listaPlatos = cat.platos || cat.plato || [];
      const platosCoincidentes = listaPlatos.filter((plato) =>
        plato.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      );
      return { ...cat, platosFiltrados: platosCoincidentes };
    })
    .filter((cat) => cat.platosFiltrados.length > 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nuestro Menú</h1>
        <p className={styles.subtitle}>
          Explora nuestros platos y arma tu pedido directo a la mesa
        </p>
      </header>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar plato por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.categoryTabs}>
          <button
            type="button"
            onClick={() => setCategoriaSeleccionada("todas")}
            className={`${styles.tabButton} ${
              categoriaSeleccionada === "todas" ? styles.activeTab : ""
            }`}
          >
            Todas
          </button>

          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`${styles.tabButton} ${
                categoriaSeleccionada === cat.id ? styles.activeTab : ""
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {categoriasFiltradas.length === 0 ? (
        <p className={styles.statusMessage}>
          No encontramos platos que coincidan con tu búsqueda.
        </p>
      ) : (
        categoriasFiltradas.map((categoria) => (
          <section key={categoria.id} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{categoria.nombre}</h2>

            <div className={styles.dishesGrid}>
              {categoria.platosFiltrados.map((plato) => (
                <article
                  key={plato.id}
                  className={`${styles.card} ${
                    !plato.disponible ? styles.cardUnavailable : ""
                  }`}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={
                        plato.imagen ||
                        "https://via.placeholder.com/400x250?text=Sin+Imagen"
                      }
                      alt={plato.nombre}
                      className={styles.dishImage}
                    />
                    {!plato.disponible && (
                      <span className={styles.badgeOut}>Agotado</span>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.dishName}>{plato.nombre}</h3>
                    <p className={styles.dishDescription}>
                      {plato.descripcion}
                    </p>

                    <div className={styles.cardFooter}>
                      <span className={styles.price}>
                        ${Number(plato.precio).toLocaleString("es-CO")}
                      </span>

                      <button
                        type="button"
                        disabled={!plato.disponible}
                        className={styles.addButton}
                        onClick={() => handleAgregar(plato)}
                      >
                        {!plato.disponible
                          ? "No disponible"
                          : agregadoId === plato.id
                            ? "✓ Agregado"
                            : "Agregar"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
