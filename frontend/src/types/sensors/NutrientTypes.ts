import { z } from "zod";


export const NutrientTypesSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export type NutrientType = z.infer<typeof NutrientTypesSchema>

export type CreateNutrientType = Pick<NutrientType, 'name'>

// Listar Tipos
export const NutrientTypesListSchema = z.array(NutrientTypesSchema)


