import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Inicializar el carrito leyendo localStorage (si el usuario recarga la página, no pierde su pedido)
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito_menu");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Guardar automáticamente en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("carrito_menu", JSON.stringify(items));
  }, [items]);

  // 1. Agregar plato (si ya existe, suma 1 a la cantidad)
  const agregarAlCarrito = (plato) => {
    setItems((prevItems) => {
      const existente = prevItems.find((item) => item.plato_id === plato.id);

      if (existente) {
        return prevItems.map((item) =>
          item.plato_id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          plato_id: plato.id,
          nombre: plato.nombre,
          precio: Number(plato.precio),
          imagen: plato.imagen,
          cantidad: 1,
        },
      ];
    });
  };

  // 2. Aumentar o disminuir cantidad desde la vista del carrito
  const actualizarCantidad = (platoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(platoId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.plato_id === platoId ? { ...item, cantidad: nuevaCantidad } : item,
      ),
    );
  };

  // 3. Quitar un plato completo del carrito
  const eliminarDelCarrito = (platoId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.plato_id !== platoId),
    );
  };

  // 4. Vaciar todo el carrito después de enviar el pedido
  const vaciarCarrito = () => {
    setItems([]);
  };

  // Totales calculados automáticamente
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para consumir el carrito en una sola línea
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
