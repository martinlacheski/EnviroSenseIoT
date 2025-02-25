

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { Type, TypesSchema, TypesListSchema, CreateType } from "@/types/types/types";


// Crear un Tipo
export async function createType(formData: CreateType) {
    try {
        // console.log(formData)
        const { data } = await api.post('/environments/types/', formData)
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
export async function getTypes() {
    try {
        const { data } = await api('/environments/types/')

        // console.log(data)
        // const response = TypesListSchema.safeParse(data)

        const response = TypesListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        console.log(error)
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


// Definimos el tipo de API para Actualizar un Usuario
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
            throw new Error(error.response.data.error)
        }
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