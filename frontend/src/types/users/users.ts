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


export type User = z.infer<typeof userSchema>
export type UserEdit = z.infer<typeof userSchemaEdit>
export type UserFormData = Pick<User, 'username' | 'password' | 'name' |  'surname' | 'email' | 'enabled' | 'is_admin' >
export type UserProfileForm = Pick<User, 'name' | 'surname' >
export type UpdateCurrentUserPasswordForm = Pick<UserEdit, 'current_password' | 'new_password' | 'new_password_confirmation' >