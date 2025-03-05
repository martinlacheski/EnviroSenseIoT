

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { CreateEnvironment, Environment, EnvironmentsListSchema, EnvironmetSchema } from "@/types/environment/environment";


// Crear un Ambiente
export async function createEnvironment(formData: CreateEnvironment) {
    try {
        const { data } = await api.post('/environments/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Ambiente
export async function getEnvironments() {
    try {
        const { data } = await api('/environments/')
        const response = EnvironmentsListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Ambiente
export async function getEnvironmentById(id: Environment['id']) {
    try {
        const { data } = await api(`/environments/${id}`)
        const response = EnvironmetSchema.safeParse(data)
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
type EnvironmentAPI = {
    formData: Environment
    typeId: Environment['id']
}

// Actualizar un Ambiente
export async function updateEnvironment({ formData }: EnvironmentAPI) {
    try {
        const { data } = await api.put<string>('/environments/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el ambiente");
        }
        throw new Error("Error desconocido al actualizar el ambiente");
    }
}

// Eliminar un Ambiente
export async function deleteEnvironment(id: Environment['id']) {
    try {
        const url = `/environments/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}