import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { member, updateMemberSchema } from "./modules/members/member.schema";
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