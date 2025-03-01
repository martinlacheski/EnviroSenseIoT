import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { Company, companySchema } from "@/types/company/company";

// Obtener la empresa
export async function getCompany() {
    try {
        const { data } = await api('/company');
        // Verificar si data es un array y tiene al menos un elemento
        if (Array.isArray(data)) {
            if (data.length === 0) {
                throw new Error("No se encontraron empresas.");
            }
            // Tomar la primera empresa del array
            const company = data[0];
            // Validar la empresa con el esquema
            const response = companySchema.safeParse(company);
            if (response.success) {
                return response.data; // Devuelve la primera empresa validada
            } else {
                throw new Error("Datos de la empresa no válidos.");
            }
        } else {
            throw new Error("La respuesta no es un array.");
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || "Error al obtener la empresa.");
        }
    }
}

// Actualizar la empresa
export async function updateCompany(formData: Company) {
    try {
        const { data } = await api.put<string>('/company/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el tipo de rol");
        }
        throw new Error("Error desconocido al actualizar el tipo de rol");
    }
}