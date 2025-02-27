

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { CreateNutrientType, NutrientType, NutrientTypesListSchema, NutrientTypesSchema } from "@/types/index";


// Crear un Tipo de Nutriente
export async function createNutrientType(formData: CreateNutrientType) {
    try {
        // console.log(formData)
        const { data } = await api.post('/nutrients/types/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            console.log(errorMessage);

            throw new Error(errorMessage);
        }
    }
}

// Listar los Tipos
export async function getNutrientTypes() {
    try {
        const { data } = await api('/nutrients/types/')
        const response = NutrientTypesListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Tipo
export async function getNutrientTypeById(id: NutrientType['id']) {
    try {
        const { data } = await api(`/nutrients/types/${id}`)
        const response = NutrientTypesSchema.safeParse(data)
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
type NutrientTypeAPI = {
    formData: NutrientType
    typeId: NutrientType['id']
}

// Actualizar un Tipo
export async function updateNutrientType({ formData }: NutrientTypeAPI) {
    try {
        const { data } = await api.put<string>('/nutrients/types/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el tipo de nutriente");
        }
        throw new Error("Error desconocido al actualizar el tipo de nutriente");
    }
}

// Eliminar un Tipo
export async function deleteNutrientType(id: NutrientType['id']) {
    try {
        const url = `/nutrients/types/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}