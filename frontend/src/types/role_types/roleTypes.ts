import { z } from "zod";


export const RoleTypesSchema = z.object({
    id: z.string(),
    name: z.string(),
    is_admin: z.boolean(),
})

export type RoleType = z.infer<typeof RoleTypesSchema>

export type CreateRoleType = Pick<RoleType, 'name' | 'is_admin'>

// Listar Tipos
export const RoleTypesListSchema = z.array(RoleTypesSchema)


