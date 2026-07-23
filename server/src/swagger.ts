import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member, updateMemberSchema, updateProfileSchema, updatePasswordSchema, updateAccountSchema } from "./modules/members/member.schema";
import { loginSchema } from "./modules/auth/auth.schema";
import { jobOfferSchema, jobOfferDetailSchema, jobOfferFullSchema } from "./modules/job_offers/job.offers.schema"; // Import the new schema
export const registry = new OpenAPIRegistry();

const bearerAuthName = 'bearerAuth';

registry.registerComponent('securitySchemes', bearerAuthName, {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

const publicMember = member.omit({ password: true }).openapi('PublicMember');

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
    path: "/api/jobs",
    description: "This endpoint creates a new job offer.",
    summary: "Create a new job offer",
    tags: ["Job Offers"],
    request: {
        body: {
            description: "Job offer data to create.",
            content: {
                "application/json": {
                    schema: jobOfferFullSchema.omit({ PK_id: true }),
                },
            },
        },
    },
    responses: {
        201: {
            description: "Job offer created successfully.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Offre d'emploi ajoutée avec succès." }),
                        id: z.number().int(),
                    }),
                },
            },
        },
        400: {
            description: "Bad request, e.g., validation error.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Erreur de validation des données." }),
                        errors: z.record(z.string(), z.array(z.string())).optional(),
                    }),
                },
            },
        },
        500: {
            description: "Internal server error.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "Internal Server Error" }) })
                }
            }
        },
    },
});

registry.registerPath({
    method: "put",
    path: "/api/jobs/{id}",
    description: "This endpoint updates an existing job offer.",
    summary: "Update a job offer",
    tags: ["Job Offers"],
    parameters: [{
        in: 'path',
        name: 'id',
        schema: { type: 'string' },
        required: true,
        description: 'Unique identifier of the job offer to update.',
    }],
    request: {
        body: {
            description: "Job offer data to update.",
            content: {
                "application/json": {
                    schema: jobOfferFullSchema.omit({ PK_id: true }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Job offer updated successfully.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Offre d'emploi mise à jour avec succès." }),
                    }),
                },
            },
        },
        400: {
            description: "Bad request, e.g., invalid ID or validation error.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Identifiant d'offre invalide." }),
                        errors: z.record(z.string(), z.array(z.string())).optional(),
                    }),
                },
            },
        },
        404: {
            description: "Not Found, e.g., job offer with the specified ID does not exist.",
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "L'offre d'emploi à mettre à jour n'existe pas." }) })
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
        },
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/jobs/{id}",
    description: "This endpoint deletes a job offer by its unique identifier.",
    summary: "Delete a job offer by ID",
    tags: ["Job Offers"],
    parameters: [{
        in: 'path',
        name: 'id',
        schema: { type: 'string' },
        required: true,
        description: 'Unique identifier of the job offer to delete.',
    }],
    responses: {
        200: {
            description: "Job offer deleted successfully.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Offre d'emploi supprimée avec succès." }),
                    }),
                },
            },
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
                    schema: errorSchema.extend({ error: z.string().openapi({ example: "L'offre d'emploi à supprimer n'existe pas." }) })
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
    path: "/api/jobs/count",
    description: "This endpoint retrieves the total number of active job offers.",
    summary: "Get total number of active job offers",
    tags: ["Job Offers"],
    responses: {
        200: {
            description: "Total number of active job offers.",
            content: {
                "application/json": {
                    schema: z.object({
                        total: z.number().int(),
                    }),
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
    security: [{ [bearerAuthName]: [] }, {}],
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
    security: [{ [bearerAuthName]: [] }, {}],
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
        429: { 
            description: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Trop de tentatives de connexion. Veuillez réessayer plus tard." })
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
    path: "/api/members/me",
    description: "Récupérer le profil du membre actuellement connecté",
    summary: "Profil du membre connecté",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    responses: {
        200: {
            description: "Profil du membre connecté.",
            content: {
                "application/json": {
                    schema: publicMember
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
        404: {
            description: "Membre non trouvé",
            content:  {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Membre non trouvé." })
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
    path: "/api/admin/members",
    description: "Récupérer la liste de tous les membres ou filtrer par rôle (accessible uniquement aux administrateurs)",
    summary: "Liste et filtrage des membres",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        query: z.object({
            role: z.string().optional().openapi({
                description: "Filtre optionnel pour récupérer un type spécifique d'utilisateurs. Valeurs acceptées : 'admin', 'candidat', 'entreprise'.",
                example: "candidat"
            })
        })
    },
    responses: {
        200: {
            description: "Liste des membres récupérée avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Liste des candidats récupérée avec succès." }),
                        members: z.array(publicMember)
                    })
                }
            }
        },
        400: {
            description: "Rôle invalide fourni dans l'URL.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Rôle invalide. Utilisez 'admin', 'candidat' ou 'entreprise'." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Aucun membre trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Aucun membre trouvé pour ce rôle." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/admin/members/ban",
    description: "Bannir un membre (accessible uniquement aux administrateurs)",
    summary: "Bannir un membre",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        query: z.object({
            email: z.string().email().openapi({ example: "user@example.com" })
        }),
    },
    responses: {
        200: {
            description: "Membre banni avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Membre banni avec succès." })
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "delete",
    path: "/api/admin/members/unban",
    description: "Débannir un membre (accessible uniquement aux administrateurs)",
    summary: "Débannir un membre",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        query: z.object({
            email: z.string().email().openapi({ example: "user@example.com" })
        }),
    },
    responses: {
        200: {
            description: "Membre débanni avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Membre débanni avec succès." })
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé。" })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur。",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur。" })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "put",
    path: "/api/admin/members/:id",
    description: "Mettre à jour le profil d'un membre (accessible uniquement aux administrateurs)",
    summary: "Mettre à jour le profil d'un membre",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Les données du profil à mettre à jour",
            content: {
                "application/json": {
                    schema: updateMemberSchema,
                },
            },
        },
        query: z.object({
            id: z.number().int().positive().openapi({ example: 1 })
        })
    },
    responses: {
        200: {
            description: "Profil du membre mis à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Profil du membre mis à jour avec succès." }),
                        member: publicMember
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        409: {
            description: "Conflit de mise à jour. Les données fournies entrent en conflit avec les données existantes.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Conflit de mise à jour. Les données fournies entrent en conflit avec les données existantes." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "patch",
    path: "/api/admin/members/:id/role",
    description: "Mettre à jour le rôle d'un membre (accessible uniquement aux administrateurs)",
    summary: "Mettre à jour le rôle d'un membre",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Le nouveau rôle du membre",
            content: {
                "application/json": {
                    schema: z.object({
                        role: z.string().openapi({ example: "candidat" })
                    })
                }
            }
        },
        query: z.object({
            id: z.number().int().positive().openapi({ example: 1 })
        })
    },
    responses: {
        200: {
            description: "Rôle du membre mis à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Rôle du membre mis à jour avec succès." }),
                        member: publicMember
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "patch",
    path: "/api/admin/members/:id/password",
    description: "Mettre à jour le mot de passe d'un membre (accessible uniquement aux administrateurs)",
    summary: "Mettre à jour le mot de passe d'un membre",
    tags: ["Administration"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Le nouveau mot de passe du membre",
            content: {
                "application/json": {
                    schema: z.object({
                        password: z.string().min(6).openapi({ example: "newSecurePassword123" })
                    })
                }
            }
        },
        query: z.object({
            id: z.number().int().positive().openapi({ example: 1 })
        })
    },
    responses: {
        200: {
            description: "Mot de passe du membre mis à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Mot de passe du membre mis à jour avec succès." }),
                        member: publicMember
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        403: {
            description: "Accès refusé. L'utilisateur n'est pas un administrateur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Accès refusé, vous devez être un administrateur." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "put",
    path: "/api/members/me",
    description: "Mettre à jour le profil du membre actuellement connecté",
    summary: "Mettre à jour le profil du membre connecté",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Les données du profil à mettre à jour",
            content: {
                "application/json": {
                    schema: updateProfileSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Profil mis à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Profil mis à jour avec succès." }),
                        member: publicMember
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "patch",
    path: "/api/members/me/password",
    description: "Mettre à jour le mot de passe du membre actuellement connecté",
    summary: "Mettre à jour le mot de passe du membre connecté",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Le nouveau mot de passe",
            content: {
                "application/json": {
                    schema: updatePasswordSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Mot de passe mis à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Mot de passe mis à jour avec succès." }),
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "patch",
    path: "/api/members/me/account",
    description: "Mettre à jour les informations de compte du membre actuellement connecté",
    summary: "Mettre à jour les informations de compte du membre connecté",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        body: {
            description: "Les nouvelles informations de compte",
            content: {
                "application/json": {
                    schema: updateAccountSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Informations de compte mises à jour avec succès.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Informations de compte mises à jour avec succès." }),
                        member: publicMember
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "delete",
    path: "/api/members/me",
    description: "Supprimer le compte du membre actuellement connecté",
    summary: "Supprimer le compte du membre connecté",
    tags: ["Membres"],
    security: [{ [bearerAuthName]: [] }],
    responses: {
        204: {
            description: "Compte supprimé avec succès.",
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        404: {
            description: "Membre non trouvé.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Membre non trouvé." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "get",
    path: "/api/candidates/redirect/{jobId}",
    description: "Rediriger vers le site de l'offre d'emploi",
    summary: "Rediriger vers le site de l'offre d'emploi",
    tags: ["Candidats"],
    security: [{ [bearerAuthName]: [] }],
    request: {
        params: z.object({
            jobId: z.int().openapi({ description: "L'ID de l'offre d'emploi pour laquelle rediriger" })
        })
    },
    responses: {
        200: {
            description: "Redirection vers le site de l'offre.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "Redirection vers le site de l'offre." }),
                        url: z.string().openapi({ example: "https://example.com/job/123" })
                    })
                }
            }
        },
        400: {
            description: "Requête invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Requête invalide." })
                    })
                }
            }
        },
        401: {
            description: "Non autorisé. Le token JWT est manquant ou invalide.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Non autorisé. Le token JWT est manquant ou invalide." })
                    })
                }
            }
        },
        404: {
            description: "Offre d'emploi non trouvée.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Offre d'emploi non trouvée." })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean().openapi({ example: false }),
                        message: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});
registry.registerPath({
    method: "post",
    path: "/api/security-demo/demo-register-vulnerable",
    description: "Route de démonstration pour l'enregistrement d'un utilisateur (vulnérable aux attaques XSS car non nettoyé)",
    summary: "Enregistrement d'un utilisateur (démonstration XSS)",
    tags: ["Démonstration de sécurité"],
    request: {
        body: {
            description: "Les informations de l'utilisateur à enregistrer",
            content: {
                "application/json": {
                    schema: z.object({
                        username: z.string().openapi({ example: "newuser" }),
                        email: z.string().email().openapi({ example: "newuser@example.com" }),
                        password: z.string().openapi({ example: "password123" }),
                        firstname: z.string().openapi({ example: "<img src=x onerror=alert(1)>" }),
                        lastname: z.string().openapi({ example: "Dupont" })
                    })
                }
            }
        }
    },
    responses: {
        201: {
            description: "Utilisateur créé avec succès (avec données non filtrées).",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "⚠️ Utilisateur créé avec des données non nettoyées dans le prénom/nom !" }),
                        savedFirstname: z.string().openapi({ example: "<img src=x onerror=alert(1)>" }),
                        savedLastname: z.string().openapi({ example: "Dupont" })
                    })
                }
            }
        },
        500: {
            description: "Erreur interne du serveur ou syntaxe SQL.",
            content: {
                "application/json": {
                    schema: z.object({
                        error: z.string().openapi({ example: "Erreur interne du serveur." })
                    })
                }
            }
        }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/security-demo/demo-sql-injection",
    description: "Route de démonstration pour l'attaque par injection SQL (utilisation de concaténation vulnérable)",
    summary: "Attaque par injection SQL sur le login (démonstration)",
    tags: ["Démonstration de sécurité"],
    request: {
        body: {
            description: "Les informations d'identification de l'utilisateur",
            content: {
                "application/json": {
                    schema: z.object({
                        username: z.string().openapi({ example: "' OR '1'='1' #" }),
                        password: z.string().openapi({ example: "password123" })
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: "Succès de l'attaque par injection SQL.",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string().openapi({ example: "⚠️ Succès de l'attaque ! L'injection SQL a fonctionné." }),
                        userFound: z.object({
                            PK_id: z.number().int().openapi({ example: 1 }),
                            username: z.string().openapi({ example: "admin" }),
                            hashed_password: z.string().openapi({ example: "$2b$10$..." })
                        })
                    })
                }
            }
        },
        500: {
            description: "Erreur de syntaxe SQL ou erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: z.object({
                        error: z.string().openapi({ example: "You have an error in your SQL syntax..." })
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