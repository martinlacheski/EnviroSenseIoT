

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { CreateEnvironmentalSensor, EnvironmentalSensor, EnvironmentalSensorListSchema, EnvironmentalSensorSchema } from "@/types/index";


// Crear un Sensor Ambiental
export async function createEnvironmentalSensor(formData: CreateEnvironmentalSensor) {
    try {
        const { data } = await api.post('/sensors/environmental/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Sensores Ambientales
export async function getEnvironmentalSensors() {
    try {
        const { data } = await api('/sensors/environmental/')
        const response = EnvironmentalSensorListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Sensor Ambiental
export async function getEnvironmentalSensorById(id: EnvironmentalSensor['id']) {
    try {
        const { data } = await api(`/sensors/environmental/${id}`)
        const response = EnvironmentalSensorSchema.safeParse(data)
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
type EnvironmentalSensorAPI = {
    formData: EnvironmentalSensor
    typeId: EnvironmentalSensor['id']
}

// Actualizar un Sensor Ambiental
export async function updateEnvironmentalSensor({ formData }: EnvironmentalSensorAPI) {
    try {
        const { data } = await api.put<string>('/sensors/environmental/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el sensor ambiental");
        }
        throw new Error("Error desconocido al actualizar el sensor ambiental");
    }
}

// Eliminar un Sensor Ambiental
export async function deleteEnvironmentalSensor(id: EnvironmentalSensor['id']) {
    try {
        const url = `/sensors/environmental/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}