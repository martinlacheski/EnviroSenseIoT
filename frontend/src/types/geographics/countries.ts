import { z } from "zod";


export const CountriesSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export type Country = z.infer<typeof CountriesSchema>

export type CreateCountry = Pick<Country, 'name'>

// Listar
export const CountriesListSchema = z.array(CountriesSchema)


