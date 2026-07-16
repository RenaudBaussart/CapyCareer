import rateLimit from "express-rate-limit";


/**
 * Limite les connexions à 3 tentatives toutes les minutes en cas d'erreur d'authentification.
 */
export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 3,
    message: {
        message: "Trop de tentatives de connexion échouées. Veuillez réessayer dans 15 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});