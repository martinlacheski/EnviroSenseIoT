import { z } from "zod";


export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    enabled: z.boolean(),
    is_admin: z.boolean(),
})

export const userSchemaEdit = z.object({
    id: z.string(),
    username: z.string(),
    current_password: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    enabled: z.boolean(),
    is_admin: z.boolean(),
    new_password: z.string(),
    new_password_confirmation: z.string()
})

export const UserListSchema = z.array(userSchema.pick({
    id: true,
    username: true,
    password: true,
    name: true,
    surname: true,
    email: true,
    enabled: true,
    is_admin: true
}))

export type User = z.infer<typeof userSchema>

export type CurrentUser = z.infer<typeof userSchemaEdit>

// Listar usuarios
export type UsersList = Pick<User, 'id' | 'username' | 'password' | 'name' | 'surname' | 'email' | 'enabled' | 'is_admin'>

// Usuario
export type UserFormData = Pick<User, 'username' | 'password' | 'name' | 'surname' | 'email' | 'enabled' | 'is_admin'>

// Editar Usuario
export type UserEdit = Pick<User, 'id' | 'username' | 'name' | 'surname' | 'email' | 'enabled' | 'is_admin'>

// Usuario actual
export type UserProfileForm = Pick<User, 'name' | 'surname'>

// Cambiar Contraseña desde el usuario actual
export type UpdateCurrentUserPasswordForm = Pick<CurrentUser, 'current_password' | 'new_password' | 'new_password_confirmation'>

// Cambiar Contraseña desde usuarios administradores
export type UpdateUserPasswordForm = Pick<CurrentUser, 'id' | 'new_password' | 'new_password_confirmation'>