import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member } from "./modules/members/member.schema";

export const registry = new OpenAPIRegistry();

registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    description: "Inscrire un nouveau membre dans l'application",
    summary: "Inscription",
    tags: ["Authentification"],
    request: {
        body: {
            description: "Les données nécessaires pour créer un compte",
            content: {
                "application/json": {
                    schema: member, 
                },
            },
        },
    },
    responses: {
        201: {
            description: "Membre enregistré avec succès",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Membre enregistré avec succès." }),
                        token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
                    })
                }
            }
        },
        409: { description: "Un membre avec cet email existe déjà." },
        400: { description: "Erreur de validation des données." }
    },
});

export function generateOpenAPI() {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "API CappyCareer",
            description: "Documentation interactive de l'API CappyCareer",
        },
        servers: [
            { url: "http://localhost:5000", description: "Serveur de développement" }
        ],
    });
}