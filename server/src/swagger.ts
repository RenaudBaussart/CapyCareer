import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member } from "./modules/members/member.schema";
import { loginSchema } from "./modules/auth/auth.schema";

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

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
        400: { 
            description: "Erreur de validation des données.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur de validation des données." }),
                        errors: z.record(z.string(), z.array(z.string())).openapi({
                            example: { email: ["email format invalid !"] } 
                        })
                    })
                }
            }
        },
        409: { 
            description: "Un membre avec cet email existe déjà.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Un membre avec cet email existe déjà." })
                    })
                }
            }
        },
        500: { 
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    },
});

registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    description: "Authentifier un membre existant et récupérer un token JWT",
    summary: "Connexion",
    tags: ["Authentification"], 
    request: {
        body: {
            description: "Les identifiants de connexion",
            content: {
                "application/json": {
                    schema: loginSchema,
                },
            },
        },
    },
    responses: {
        200: { 
            description: "Connexion réussie, retourne le token",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Connexion réussie." }),
                        token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
                    })
                }
            }
        },
        400: { 
            description: "Format des données invalide (ex: username manquant).",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur de validation des données." }),
                            errors: z.record(z.string(), z.array(z.string())).openapi({     
                            example: { username: ["Username must have at least 3 letters"] } 
                        })
                    })
                }
            }
        },
        401: { 
            description: "Identifiants incorrects (Unauthorized).",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Identifiants incorrects." })
                    })
                }
            }
        },
        500: { 
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    },
});

registry.registerPath({
    method: "post",
    path: "/api/auth/logout",
    description: "Déconnecter un membre et invalider son token JWT",
    summary: "Déconnexion",
    tags: ["Authentification"],
    
    security: [{ [bearerAuth.name]: [] }], 

    responses: {
        200: {
            description: "Déconnexion réussie.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Déconnexion réussie." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
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