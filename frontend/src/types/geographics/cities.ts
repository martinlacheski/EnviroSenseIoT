import { z } from "zod";

export const CitiesSchema = z.object({
    id: z.string(),
    province_id: z.string(),
    name: z.string(),
    postal_code: z.string(),
})

export type City = z.infer<typeof CitiesSchema>

export type CreateCity = Pick<City, 'province_id' | 'name' | 'postal_code'>

// Listar
export const CitiesListSchema = z.array(CitiesSchema)

