import styles from './ProductCard.module.css';

export function ProductCard({ nombre, descripcion, precio, onAgregar }) {
  return (
    <article className={styles.card}>
      <div>
        <h2 className={styles.title}>{nombre}</h2>
        <p className={styles.description}>{descripcion}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>${precio.toLocaleString('es-CO')}</span>
        <button type="button" onClick={onAgregar} className={styles.addButton}>
          + Agregar
        </button>
      </div>
    </article>
  );
}