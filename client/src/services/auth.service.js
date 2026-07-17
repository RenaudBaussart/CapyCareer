// fichier gerant lenvoi de la requete vers le back (communique avec lapi)

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
    // envoie requete back
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    // transforme en JSON
    const data = await response.json();

    // gere les erreurs du back
    // WARNING: a revoir car peut etre specifié
    if (!response.ok) {
        // passe lerreur au component
        throw new Error(data.message || "Identifiant ou mot de passe incorrect");
    }

    // SI bon return les datas
    return data;
};