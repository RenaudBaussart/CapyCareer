import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member } from "./modules/members/member.schema";
import { loginSchema } from "./modules/auth/auth.schema";

export const registry = new OpenAPIRegistry();

const bearerAuthName = 'bearerAuth';

registry.registerComponent('securitySchemes', bearerAuthName, {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

const publicMember = member.omit({ password: true }).openapi('PublicMember');

registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    description: "Inscrire un nouveau membre dans l'application",
    summary: "Inscription",
    tags: ["Authentification"],
    security: [{ [bearerAuth.name]: [] }, {}],
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
        403: {
            description: "Membre déjà connecté.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Vous êtes déjà connecté." })
                    })
                }
            }
        },
        409: { 
            description: "Cet utilisateur existe déjà.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Un membre avec cet utilisateur existe déjà." })
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
    security: [{ [bearerAuth.name]: [] }, {}],
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
        403: {
            description: "Membre déjà connecté.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Vous êtes déjà connecté." })
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
    
    security: [{ [bearerAuthName]: [] }], 

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
        401: {
            description: "Token invalide ou expiré.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Token invalide." })
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

registry.registerPath({
    method: "get",
    path: "/api/members",
    description: "Récupérer tous les profils des membres",
    summary: "Lister les membres",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    responses: {
        200: {
            description: "Liste des profils des membres.",
            content: {
                "application/json": {
                    schema: z.array(publicMember).openapi({
                        example: [
                            {
                                id: 1,
                                username: "Jojodu59",
                                email: "jojo@example.com",
                                firstname: "Jonathan",
                                lastname: "Decroix",
                                role: "candidat"
                            }
                        ]
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'a pas les droits nécessaires.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Accès refusé. L'utilisateur n'a pas les droits nécessaires." })
                    })
                }
            }
        },
        404: {
            description: "Aucun membre trouvé",
            content:  {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Aucun membre trouvé." })
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
            title: "API CapyCareer",
            description: "Documentation interactive de l'API CapyCareer",
        },
        servers: [
            { url: "http://localhost:5000", description: "Serveur de développement" }
        ],
    });
}