import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const loginSchema = z.object({
    username: z.string()
        .min(1, "Le pseudonyme est requis")
        .openapi({
            example: "Jojodu59",
            description: "Le pseudonyme public du membre"
        }),
    password: z.string()
        .min(1, "Le mot de passe est requis")
        .openapi({
            example: "HelloWorld0/",
            description: "Le mot de passe en clair"
        }),
    stayConnected: z.boolean()
        .openapi({
            example: "true",
            description: "Si l'utilisateur veux rester connecter"
        })
}).openapi("LoginRequest");