import axios from "axios";

// ✅ Instancia principal de Axios
const API = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true, // Enviar cookies y mantener sesión
});

// ✅ Función auxiliar para obtener cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ✅ Interceptor: agrega CSRF token automáticamente
API.interceptors.request.use(async (config) => {
  let csrfToken = getCookie("csrftoken");

  // Si no hay token, lo obtenemos desde el backend
  if (!csrfToken) {
    try {
      await axios.get("http://localhost:8000/api/auth/csrf/", {
        withCredentials: true,
      });
      csrfToken = getCookie("csrftoken");
    } catch (err) {
      console.warn("⚠️ No se pudo obtener el CSRF token automáticamente.");
    }
  }

  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

// ✅ Funciones API unificadas (todas usan la instancia configurada)
export const getProjects = () => API.get("projects/");
export const createProject = (project) => API.post("projects/", project);
export const updateProject = (id, project) => API.put(`projects/${id}/`, project);
export const deleteProject = (id) => API.delete(`projects/${id}/`);

// Exportar por defecto la instancia
export default API;