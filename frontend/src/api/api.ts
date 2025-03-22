import axios from "axios";
import { getEnvs } from "../helpers";

const { VITE_API_URL } = getEnvs();

const api = axios.create({
    baseURL: VITE_API_URL,
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
