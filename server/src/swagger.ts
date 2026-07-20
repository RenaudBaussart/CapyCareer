import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member } from "./modules/members/member.schema";
import { loginSchema } from "./modules/auth/auth.schema";
import { jobOfferSchema, jobOfferDetailSchema } from "./modules/job_offers/job.offers.schema"; // Import the new schema

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

// #region Job Offers Schemas
const jobOffersResponseSchema = z.object({
    job_offers: z.array(jobOfferSchema),
    is_the_end: z.boolean().openapi({ description: "Indicates if there are no more job offers after this page." }),
});

const errorSchema = z.object({
    error: z.string()
});
// #endregion

registry.registerPath({
    method: "get",
    path: "/api/jobs",
    description: "This endpoint retrieves a paginated list of job offers from the database.",
    summary: "Retrieve a list of job offers",
    tags: ["Job Offers"],
    parameters: [{
        in: 'query',
        name: 'page',
        schema: { type: 'integer', minimum: 1 },
        required: false,
        description: 'Page number for pagination. Must be a positive integer.',
    }],
    responses: {
        200: {
            description: "A paginated list of job offers.",
            content: {
                "application/json": {
                    schema: jobOffersResponseSchema,
                }
            }
        },
        400: {
            description: "Bad request, e.g., invalid page number.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Le numéro de page doit être un entier positif." }) })
                }
            }
        },
        404: {
            description: "Not Found, e.g., no job offers for the requested page.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Aucune offre d'emploi trouvée pour cette page." }) })
                }
            }
        },
        500: {
            description: "Internal server error.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Internal Server Error" }) })
                }
            }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/jobs/{id}",
    description: "This endpoint retrieves a single job offer by its unique identifier.",
    summary: "Retrieve a single job offer by ID",
    tags: ["Job Offers"],
    parameters: [{
        in: 'path',
        name: 'id',
        schema: { type: 'string' },
        required: true,
        description: 'Unique identifier of the job offer.',
    }],
    responses: {
        200: {
            description: "A single job offer object.",
            content: {
                "application/json": {
                    schema: jobOfferDetailSchema,
                }
            }
        },
        400: {
            description: "Bad request, e.g., missing or invalid job offer ID.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Identifiant d'offre manquant." }) })
                }
            }
        },
        404: {
            description: "Not Found, e.g., job offer with the specified ID does not exist.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "L'offre d'emploi demandée n'a pas été trouvée." }) })
                }
            }
        },
        500: {
            description: "Internal server error.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Internal Server Error" }) })
                }
            }
        }
    }
});


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
                        token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5c4IkpXVCJ9..." })
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