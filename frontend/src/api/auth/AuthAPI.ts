import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { UserLoginForm, userSchema } from "@/types/index";

export async function loginUser(formData: UserLoginForm): Promise<string> {
    try {
        // Convertir el objeto formData a URLSearchParams
        const formBody = new URLSearchParams();
        formBody.append("username", formData.username);
        formBody.append("password", formData.password);

        // Se envía formData en el body de la petición POST
        const { data } = await api.post("/login", formBody);
        localStorage.setItem('AUTH_TOKEN', data.access_token);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
        throw new Error("Error al intentar iniciar sesión.");
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/users/me/');
        const response = userSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                // Si es un error de autenticación, redireccionar al login
                localStorage.removeItem("AUTH_TOKEN"); // Asegurar que el token se elimina
                window.location.href = "/login"; // Redirigir manualmente al login
                return null; // Retornar null para evitar propagar el error
            }
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
        throw new Error("Error al intentar obtener el usuario.");
    }
}