const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// --- PEDIDOS Y ESTADÍSTICAS ---
export const getAdminOrders = async (estado = "") => {
  const query =
    estado && estado !== "Activos"
      ? `?estado=${encodeURIComponent(estado)}`
      : "";
  const response = await fetch(`${API_URL}/orders${query}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al cargar los pedidos");
  return data;
};

export const updateAdminOrderStatus = async (id, nuevoEstado) => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al actualizar el estado");
  return data;
};

export const getTodayStats = async () => {
  const response = await fetch(`${API_URL}/orders/stats/today`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al obtener estadísticas");
  return data;
};

// --- CATEGORÍAS ---
export const getAdminCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al cargar categorías");
  return data;
};

export const createAdminCategory = async (categoryData) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al crear categoría");
  return data;
};

export const updateAdminCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al editar categoría");
  return data;
};

export const deleteAdminCategory = async (id) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al eliminar categoría");
  return data;
};

// --- PLATOS ---
export const getAdminDishes = async () => {
  const response = await fetch(`${API_URL}/dishes`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al cargar platos");
  return data;
};

export const createAdminDish = async (dishData) => {
  const response = await fetch(`${API_URL}/dishes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dishData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al crear plato");
  return data;
};

export const updateAdminDish = async (id, dishData) => {
  const response = await fetch(`${API_URL}/dishes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(dishData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al editar plato");
  return data;
};

export const toggleAdminDishAvailability = async (id, disponible) => {
  const response = await fetch(`${API_URL}/dishes/${id}/availability`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ disponible }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.mensaje || "Error al cambiar disponibilidad");
  return data;
};

export const deleteAdminDish = async (id) => {
  const response = await fetch(`${API_URL}/dishes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al eliminar plato");
  return data;
};
