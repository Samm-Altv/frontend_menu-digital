import { Link } from 'react-router';
import styles from '@/styles/NotFound.module.css';

export default function NotFound() {
  return (
    <section className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>¡Ups! Este plato no está en el menú</h1>
      <p className={styles.text}>
        La dirección que escribiste no existe o fue movida. 
        Pero no te quedes con hambre, vuelve a nuestra carta principal.
      </p>
      <Link to="/" className={styles.button}>
        Volver al Menú
      </Link>
    </section>
  );
}