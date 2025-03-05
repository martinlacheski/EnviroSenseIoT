

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { CreateNutrientSolutionSensor, NutrientSolutionSensor, NutrientSolutionSensorListSchema, NutrientSolutionSensorSchema } from "@/types/index";

// Crear un Sensor de Solución Nutritiva
export async function createNutrientSolutionSensor(formData: CreateNutrientSolutionSensor) {
    try {
        const { data } = await api.post('/sensors/nutrients/solution/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Sensores de Solución Nutritiva
export async function getNutrientSolutionSensors() {
    try {
        const { data } = await api('/sensors/nutrients/solution/')
        const response = NutrientSolutionSensorListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Sensor de Solución Nutritiva
export async function getNutrientSolutionSensorById(id: NutrientSolutionSensor['id']) {
    try {
        const { data } = await api(`/sensors/nutrients/solution/${id}`)
        const response = NutrientSolutionSensorSchema.safeParse(data)
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
type NutrientSolutionSensorAPI = {
    formData: NutrientSolutionSensor
    typeId: NutrientSolutionSensor['id']
}

// Actualizar un Sensor de Solución Nutritiva
export async function updateNutrientSolutionSensor({ formData }: NutrientSolutionSensorAPI) {
    try {
        const { data } = await api.put<string>('/sensors/nutrients/solution/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el sensor de solución nutritiva");
        }
        throw new Error("Error desconocido al actualizar el sensor de solución nutritiva");
    }
}

// Eliminar un Sensor de Solución Nutritiva
export async function deleteNutrientSolutionSensor(id: NutrientSolutionSensor['id']) {
    try {
        const url = `/sensors/nutrients/solution/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}