import styles from '@/styles/Home.module.css';
import { ProductCard } from '@/components/ProductCard/ProductCard.jsx';

const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Combo Doble Fuego',
    descripcion: 'Doble carne a la parrilla, queso cheddar derretido, tocineta crocante, papas medianas y bebida.',
    precio: 26900,
  },
  {
    id: 2,
    nombre: 'Pollo Crispy XL',
    descripcion: 'Pechuga de pollo extra crujiente, lechuga fresca, pepinillos y nuestra salsa secreta de la casa.',
    precio: 21500,
  },
  {
    id: 3,
    nombre: 'Perro Supremo',
    descripcion: 'Salchicha americana ahumada, ripio de papa, queso fundido, cebolla caramelizada y salsa de ajo.',
    precio: 16000,
  },
  {
    id: 4,
    nombre: 'Papas Bravas con Queso',
    descripcion: 'Porción grande de papas a la francesa bañadas en salsa de queso cheddar y trozos de tocineta.',
    precio: 12900,
  },
];

export default function Home({ onAgregar }) {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Sabor real, rápido y recién hecho</h1>
        <p className={styles.heroText}>
          Preparamos cada pedido al instante con ingredientes frescos y nuestras salsas originales. 
          Elige tu combo favorito y disfruta sin esperas.
        </p>
      </section>

      <section className={styles.grid}>
        {PRODUCTOS.map((producto) => (
          <ProductCard
            key={producto.id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            onAgregar={() => onAgregar(producto)}
          />
        ))}
      </section>
    </div>
  );
}