import { isAxiosError } from "axios";
import api from "../../services/api.service";
import { Country, CreateProvince, Province, ProvincesListSchema, ProvincesSchema } from "@/types/index";

// Crear una Provincia
export async function createProvince(formData: CreateProvince) {
    try {
        const { data } = await api.post('/provinces/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar las Provincias
export async function getProvinces() {
    try {
        const { data } = await api('/provinces/')
        const response = ProvincesListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {

        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener una Provincia
export async function getProvinceById(id: Province['id']) {
    try {
        const { data } = await api(`/provinces/${id}`)
        const response = ProvincesSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

/* // Obtener las Provincias del país
export async function getProvincesByCountry(id: Country['id']) {
    try {
        const { data } = await api(`/provinces/country/${id}`)
        const response = ProvincesSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
} */

// Definimos el tipo de API para Actualizar
type ProvinceAPI = {
    formData: Province
    typeId: Province['id']
}

// Actualizar una Provincia
export async function updateProvince({ formData }: ProvinceAPI) {
    try {
        const { data } = await api.put<string>('/provinces/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar la provincia");
        }
        throw new Error("Error desconocido al actualizar la provincia");
    }
}

// Eliminar una Provincia
export async function deleteProvince(id: Province['id']) {
    try {
        const url = `/provinces/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}