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
    password: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    enabled: z.boolean(),
    is_admin: z.boolean(),
})


export type User = z.infer<typeof userSchema>
export type UserFormData = Pick<User, 'username' | 'password' | 'name' |  'surname' | 'email' | 'enabled' | 'is_admin' >