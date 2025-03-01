import { isAxiosError } from "axios";
import api from "../../services/api.service";
import { CitiesListSchema, CitiesSchema, City, CreateCity, Province } from "@/types/index";

// Crear una Ciudad
export async function createCity(formData: CreateCity) {
    try {
        const { data } = await api.post('/cities/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            

            throw new Error(errorMessage);
        }
    }
}

// Listar las Ciudades
export async function getCities() {
    try {
        const { data } = await api('/cities/')
        const response = CitiesListSchema.safeParse(data)
        
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener una Ciudad
export async function getCityById(id: City['id']) {
    try {
        const { data } = await api(`/cities/${id}`)
        const response = CitiesSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Definimos el tipo de API para Actualizar
type CityAPI = {
    formData: City
    typeId: City['id']
}

// Actualizar una Ciudad
export async function updateCity({ formData }: CityAPI) {
    try {
        const { data } = await api.put<string>('/cities/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar la ciudad");
        }
        throw new Error("Error desconocido al actualizar la ciudad");
    }
}

// Eliminar una Ciudad
export async function deleteCity(id: City['id']) {
    try {
        const url = `/cities/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}