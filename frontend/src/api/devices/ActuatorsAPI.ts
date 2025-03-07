

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { Actuator, ActuatorListSchema, ActuatorSchema, CreateActuator } from "@/types/index";


// Crear un Actuador
export async function createActuator(formData: CreateActuator) {
    try {
        const { data } = await api.post('/actuators/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Actuadores
export async function getActuators() {
    try {
        const { data } = await api('/actuators/')
        const response = ActuatorListSchema.safeParse(data)
        if (response.success) {
            return response.data
        } else {
            console.error("Validation failed:", response.error)
            return [] // Devuelve un array vacío en caso de validación fallida
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        } else {
            console.error("Unknown error:", error)
            return [] // Devuelve un array vacío en caso de error desconocido
        }
    }
}

// Obtener un Actuador
export async function getActuatorById(id: Actuator['id']) {
    try {
        const { data } = await api(`/actuators/${id}`)
        const response = ActuatorSchema.safeParse(data)
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
type ActuatorAPI = {
    formData: Actuator
    typeId: Actuator['id']
}

// Actualizar un Actuador
export async function updateActuator({ formData }: ActuatorAPI) {
    try {
        const { data } = await api.put<string>('/actuators/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el actuador");
        }
        throw new Error("Error desconocido al actualizar el actuador");
    }
}

// Eliminar un Actuador
export async function deleteActuator(id: Actuator['id']) {
    try {
        const url = `/actuators/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}