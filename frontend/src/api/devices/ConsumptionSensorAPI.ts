

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { ConsumptionSensor, ConsumptionSensorListSchema, ConsumptionSensorSchema, CreateConsumptionSensor } from "@/types/index";


// Crear un Sensor de Consumo
export async function createConsumptionSensor(formData: CreateConsumptionSensor) {
    try {
        const { data } = await api.post('/sensors/consumption/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            throw new Error(errorMessage);
        }
    }
}

// Listar los Sensores de Consumos
export async function getConsumptionSensors() {
    try {
        const { data } = await api('/sensors/consumption/')
        const response = ConsumptionSensorListSchema.safeParse(data)
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

// Obtener un Sensor de Consumos
export async function getConsumptionSensorById(id: ConsumptionSensor['id']) {
    try {
        const { data } = await api(`/sensors/consumption/${id}`)
        const response = ConsumptionSensorSchema.safeParse(data)
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
type ConsumptionSensorAPI = {
    formData: ConsumptionSensor
    typeId: ConsumptionSensor['id']
}

// Actualizar un Sensor de Consumos
export async function updateConsumptionSensor({ formData }: ConsumptionSensorAPI) {
    try {
        const { data } = await api.put<string>('/sensors/consumption/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el sensor de consumos");
        }
        throw new Error("Error desconocido al actualizar el sensor de consumos");
    }
}

// Eliminar un Sensor de Consumos
export async function deleteConsumptionSensor(id: ConsumptionSensor['id']) {
    try {
        const url = `/sensors/consumption/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}