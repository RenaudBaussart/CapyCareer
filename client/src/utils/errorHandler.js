// fichier gerant la traduction des erreurs (ui/ux)

// fonction qui traduit les erreurs en fr
export const getFriendlyErrorMessage = (rawMessage) => {
    // au cas ou le le mesage est vide ou indefini
    if (!rawMessage) return "Une erreur est survenue lors de l'opération.";

    // conversion en minuscules pour faciliter la comparaison
    const message = rawMessage.toLowerCase();

    // erreurs réseau (serveur ect...)
    if (message.includes("failed to fetch") || message.includes("network error")) {
        return "Impossible de joindre le serveur. Vérifiez que vous êtes bien connecté à internet.";
    }
    // erreurs d id login (401 etc...)
    if (message.includes("401") || message.includes("incorrect") || message.includes("invalide")) {
        return "L'identifiant ou le mot de passe est incorrect.";
    }

    // erreurs express-rate-limit 429
    if (message.includes("rate limit") || message.includes("too many requests")) {
        return "Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.";
    }
    // erreurs serveur
    if (message.includes("500") || message.includes("serveur")) {
        return "Le service est temporairement indisponible suite à un problème technique.";
    }

    // dans tous les autres cas message de base
    return "Une erreur inattendue est survenue. Veuillez réessayer.";
};