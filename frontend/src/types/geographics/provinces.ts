import { z } from "zod";

export const ProvincesSchema = z.object({
    id: z.string(),
    country_id: z.string(),
    name: z.string(),
})

export type Province = z.infer<typeof ProvincesSchema>

export type CreateProvince = Pick<Province, 'country_id' | 'name'>

// Listar
export const ProvincesListSchema = z.array(ProvincesSchema)

