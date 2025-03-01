

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { Type, TypesSchema, TypesListSchema, CreateType } from "@/types/environment_types/environmentTypes";


// Crear un Tipo
export async function createType(formData: CreateType) {
    try {
        const { data } = await api.post('/environments/types/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Tipos
export async function getTypes() {
    try {
        const { data } = await api('/environments/types/')
        const response = TypesListSchema.safeParse(data)
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
export async function getTypeById(id: Type['id']) {
    try {
        const { data } = await api(`/environments/types/${id}`)
        const response = TypesSchema.safeParse(data)
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
type TypeAPI = {
    formData: Type
    typeId: Type['id']
}

// Actualizar un Tipo
export async function updateType({ formData }: TypeAPI) {
    try {
        const { data } = await api.put<string>('/environments/types/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el tipo de ambiente");
        }
        throw new Error("Error desconocido al actualizar el tipo de ambiente");
    }
}

// Eliminar un Tipo
export async function deleteType(id: Type['id']) {
    try {
        const url = `/environments/types/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}