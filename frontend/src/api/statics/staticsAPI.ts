import { isAxiosError } from "axios";

import api from "../../services/api.service";

// Subir el logo de la empresa
export async function uploadLogo(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append("file", file); // Asegúrate de que el campo sea "file"

        // Subir el archivo al servidor
        const { data } = await api.post<{ url: string }>('/statics/uploadLogo', formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Especificar el tipo de contenido
            },
        });
        console.log(data)
        return data.url; // Devolver la URL del logo subido
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al subir el logo");
        }
        throw new Error("Error desconocido al subir el logo");
    }
}