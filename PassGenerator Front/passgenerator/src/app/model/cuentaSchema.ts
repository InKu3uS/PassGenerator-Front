import { z } from "zod"

export const cuentaSchema = z.object({
    id: z.string().optional(),
    user: z.object({
        uuid: z.string(),
    }).optional(),
    createTime: z.string(),
    expirationTime: z.string(),
    site: z.string(),
    password: z.string(),
});

export type Cuenta = z.infer<typeof cuentaSchema>

export const emptyCuenta = cuentaSchema.partial();
export const createCuenta = cuentaSchema.partial({
    id:true,
    user:true,
    createTime:true
})