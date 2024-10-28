import { z } from "zod";

export const userSchema = z.object({
    uuid: z.string().optional(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    createTime: z.string().optional(),
});

export type User = z.infer<typeof userSchema>

export const emptyUserSchema = userSchema.partial().extend({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional()
});

export type emptyUser = z.infer<typeof emptyUserSchema>

// Define el esquema sin el campo 'uuid'
export const userWithoutUuidSchema = userSchema.omit({ uuid: true });

export type UserWithoutUuid = z.infer<typeof userWithoutUuidSchema>;


export const createUser = userSchema.partial({
    uuid:true,
    createTime:true,
});
