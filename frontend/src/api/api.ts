import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL, // Acceso directo a la variable de entorno de Vite
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config: any) => {
    config.headers = {
        ...config.headers,
        // "x-token": localStorage.getItem("token"),

        // Bearer token
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    return config;
});

export default api;
