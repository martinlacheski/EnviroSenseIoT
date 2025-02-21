

import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { User, UserFormData, userSchema, userSchemaEdit } from "../../types";

// Crear un usuario

export async function createUser(formData: UserFormData) {
    try {
        const { data } = await api.post('/users', formData)
        return data
    } catch (error) {
        console.log(error.response.data)
        // if (isAxiosError(error) && error.response) {
            // throw new Error(error.response.data.error)
        // }
    }
}

// Listar los usuarios
export async function getUsers() {
    try {
        const { data } = await api('/users')
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Obtener un usuario
export async function getUserById(id: User['_id']) {
    try {
        const { data } = await api(`/users/${id}`)
        const response = userSchemaEdit.safeParse(data)
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
type UserAPIType = {
    formData: UserFormData
    userId: User['_id']
}

// Actualizar un usuario
export async function updateProject({ formData, userId }: UserAPIType) {
    try {
        const { data } = await api.put<string>(`/users/${userId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Eliminar un Usuario
export async function deleteUser(id: User['_id']) {
    try {
        const url = `/users/${id}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}