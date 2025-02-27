import { z } from "zod";


export const TypesSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export type Type = z.infer<typeof TypesSchema>

export type CreateType = Pick<Type, 'name'>

// Listar Tipos
export const TypesListSchema = z.array(TypesSchema)


