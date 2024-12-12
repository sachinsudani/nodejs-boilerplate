import { z } from "zod";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    password: z
        .string()
        .min(8, { message: "Must be at least 8 characters." })
        .trim()
        .optional(),
    isAuthenticate: z
        .boolean()
        .optional()
});

export { loginSchema };
