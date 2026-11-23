const API_URL = import.meta.env.VITE_API_URL;

export const getPublicMenu = async () => {
  const response = await fetch(`${API_URL}/menu`);

  if (!response.ok) {
    throw new Error("No se pudo cargar el menú del restaurante");
  }

  return await response.json();
};
