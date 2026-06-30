import axios from 'axios';

// Configuración base de axios para comunicarse con el backend NestJS
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL del backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor — agrega el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  // Obtiene el token guardado en localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Agrega el token al header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
