import { z } from "zod";

export const authSchema = z.object({
    username: z.string(),
    password: z.string()
})

export type UserLoginForm = z.infer<typeof authSchema>