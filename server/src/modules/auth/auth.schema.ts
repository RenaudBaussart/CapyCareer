import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const loginSchema = z.object({
    username: z.string()
        .openapi({
            example: "Jojodu59",
            description: "Le pseudonyme public du membre"
        }),
    password: z.string().openapi({
        example: "HelloWorld0/",
        description: "Le mot de passe en clair"
    })
}).openapi("LoginRequest");