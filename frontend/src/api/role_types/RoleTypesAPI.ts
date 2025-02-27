import { isAxiosError } from "axios";
import api from "../../services/api.service";
import { CreateRoleType, RoleType, RoleTypesListSchema, RoleTypesSchema } from "@/types/role_types/roleTypes";


// Crear un Tipo de Rol
export async function createRoleType(formData: CreateRoleType) {
    try {
        const { data } = await api.post('/roles/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.detail || "Error desconocido en el servidor";
            console.log(errorMessage);

            throw new Error(errorMessage);
        }
    }
}

// Listar los Tipos de Roles
export async function getRoleTypes() {
    try {
        const { data } = await api('/roles/')
        const response = RoleTypesListSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {

        if (isAxiosError(error) && error.response) {

            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un Tipo de Rol
export async function getRoleTypeById(id: RoleType['id']) {
    try {
        const { data } = await api(`/roles/${id}`)
        const response = RoleTypesSchema.safeParse(data)
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
type RoleTypeAPI = {
    formData: RoleType
    typeId: RoleType['id']
}

// Actualizar un Tipo
export async function updateRoleType({ formData }: RoleTypeAPI) {
    try {
        const { data } = await api.put<string>('/roles/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || "Error al actualizar el tipo de rol");
        }
        throw new Error("Error desconocido al actualizar el tipo de rol");
    }
}

// Eliminar un Tipo de Rol
export async function deleteRoleType(id: RoleType['id']) {
    try {
        const url = `/roles/${id}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}