

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { CountriesListSchema, CountriesSchema, Country, CreateCountry } from "@/types/geographics/countries";


// Crear un Pais
export async function createCountry(formData: CreateCountry) {
    try {
        const { data } = await api.post('/countries/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            console.log(errorMessage);

            throw new Error(errorMessage);
        }
    }
}

// Listar los Paises
export async function getCountries() {
    try {
        const { data } = await api('/countries/')

        const response = CountriesListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        
        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Pais
export async function getCountryById(id: Country['id']) {
    try {
        const { data } = await api(`/countries/${id}`)
        const response = CountriesSchema.safeParse(data)
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
type CountryAPI = {
    formData: Country
    typeId: Country['id']
}

// Actualizar un Pais
export async function updateCountry({ formData }: CountryAPI) {
    try {
        const { data } = await api.put<string>('/countries/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el país");
        }
        throw new Error("Error desconocido al actualizar el país");
    }
}

// Eliminar un País
export async function deleteCountry(id: Country['id']) {
    try {
        const url = `/countries/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}