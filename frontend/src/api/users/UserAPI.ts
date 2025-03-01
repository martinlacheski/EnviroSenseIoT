import { isAxiosError } from "axios";

import api from "../../services/api.service";
import { UpdateUserPasswordForm, User, UserFormData, UserListSchema, userSchemaEdit } from "../../types";

// Crear un usuario

export async function createUser(formData: UserFormData) {
    try {
        const { data } = await api.post('/users', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Listar los usuarios
export async function getUsers() {
    try {
        const { data } = await api('/users')
        const response = UserListSchema.safeParse(data)
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
export async function getUserById(id: User['id']) {
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

// Actualizar un Usuario
export async function updateUser(formData: User) {
    try {
        const { data } = await api.put<string>('/users/', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Eliminar un Usuario
export async function deleteUser(id: User['id']) {
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

// Actualizar contraseña de un usuario
export async function changePassword(formData: UpdateUserPasswordForm) {
    try {
        const { data } = await api.patch<string>('/users/password', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail)
        }
    }
}