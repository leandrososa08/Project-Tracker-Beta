import axios from 'axios';

// ✅ Configuración principal de Axios
const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true, // Envía y recibe cookies
});

// ✅ Función auxiliar para obtener cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ✅ Interceptor: obtiene automáticamente el CSRF token si no existe
API.interceptors.request.use(async (config) => {
  let csrfToken = getCookie('csrftoken');

  // Si no hay token CSRF, lo pedimos al servidor
  if (!csrfToken) {
    try {
      await axios.get('http://localhost:8000/api/auth/csrf/', {
        withCredentials: true,
      });
      csrfToken = getCookie('csrftoken');
    } catch (err) {
      console.warn('⚠️ No se pudo obtener el CSRF token automáticamente.');
    }
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
});

export default API;