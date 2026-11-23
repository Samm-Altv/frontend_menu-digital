const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al enviar el pedido");
  }

  return data;
};

export const getOrderStatus = async (orderId) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "No se pudo consultar el pedido");
  }

  return data;
};
