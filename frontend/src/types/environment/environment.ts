import { z } from "zod";


export const EnvironmetSchema = z.object({
    id: z.string(),
    company_id: z.string(),
    city_id: z.string(),
    type_id: z.string(),
    name: z.string(),
    address: z.string(),
    gps_location: z.string(),
    description: z.string(),
})


export type Environment = z.infer<typeof EnvironmetSchema>

export type CreateEnvironment = Pick<Environment, 'company_id' | 'city_id' |
    'type_id' | 'name' | 'address' | 'gps_location' | 'description'>

// Listar
export const EnvironmentsListSchema = z.array(EnvironmetSchema)
