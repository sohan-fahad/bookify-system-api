import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    referralCode: z.string().optional()
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>