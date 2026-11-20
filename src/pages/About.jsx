import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      {/* Bloque 1: Historia genérica del restaurante */}
      <section className={styles.storyBox}>
        <h1 className={styles.title}>Nuestra Historia</h1>
        <p className={styles.paragraph}>
          Nacimos con una idea simple: demostrar que la comida rápida también
          puede ser fresca, generosa y preparada con ingredientes de verdad. Lo
          que empezó como una pequeña plancha de barrio hoy es el punto de
          encuentro favorito para quienes buscan buen sabor sin perder tiempo.
        </p>
        <p className={styles.paragraph}>
          Cada hamburguesa, perro y porción de papas sale de nuestra cocina al
          momento en que haces tu pedido, acompañada de nuestras salsas
          artesanales preparadas cada mañana.
        </p>
      </section>

      {/* Bloque 2: Tres pilares del negocio */}
      <section className={styles.valuesGrid}>
        <article className={styles.valueCard}>
          <h2 className={styles.valueTitle}>Ingredientes Frescos</h2>
          <p className={styles.valueText}>
            Seleccionamos vegetales crujientes y carnes de primera calidad todos
            los días antes de abrir.
          </p>
        </article>

        <article className={styles.valueCard}>
          <h2 className={styles.valueTitle}>Hecho al Instante</h2>
          <p className={styles.valueText}>
            Nada de comida guardada por horas. Tu orden toca la parrilla justo
            cuando la pides.
          </p>
        </article>

        <article className={styles.valueCard}>
          <h2 className={styles.valueTitle}>Salsas de la Casa</h2>
          <p className={styles.valueText}>
            Recetas secretas creadas en nuestra cocina para darle un toque único
            a cada bocado.
          </p>
        </article>
      </section>
    </div>
  );
}
