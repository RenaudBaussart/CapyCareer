// fichier gerant lenvoi de la requete vers le back (communique avec lapi)

const API_URL = import.meta.env.VITE_API_URL;


// LOGIN
export const login = async (credentials) => {
    // envoie requete back
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    // transforme en JSON
    const data = await response.json();

    // gere les erreurs du back
    if (!response.ok) {
        console.error("Détails complets de l'erreur API :", data);

        // passe lerreur au component
        throw new Error(data.message || "Identifiant ou mot de passe incorrect");
    }

    // SI bon return les datas
    return data;
};

// REGISTER CANDIDAT
export const registerUser = async (userData) => {
    // envoie requete back pour new compte
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    // transforme en JSON
    const data = await response.json();

    // gere les erreurs du back
    if (!response.ok) {
        console.error("Détails complets de l'erreur API d'inscription :", data);

        // passe lerreur au component
        throw new Error(data.message || "Erreur lors de l'inscription");
    }

    // SI bon return les datas
    return data;
};

// BLACKLIST TOKEN
export const logoutApi = async (token) => {
    // clean le token sil commence par bearer pr cibler uniquement JWT
    const cleanToken = token.replace("Bearer ", "");

    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // part en blacklist
            "Authorization": `Bearer ${cleanToken}`
        }
    });
    return response.ok;
};