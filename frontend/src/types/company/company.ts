import { z } from "zod";


export const companySchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    email: z.string().email(),
    phone: z.string(),
    webpage: z.string(),
    logo: z.string(),
    city_id: z.string(),
})


export type Company = z.infer<typeof companySchema>