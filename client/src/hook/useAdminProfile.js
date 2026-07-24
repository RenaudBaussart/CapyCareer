// fichier gerant logique page profil admin

// import
import { useState, useEffect } from "react";

export function useAdminProfile() {
    const [profileData, setProfileData] = useState({
        firstName: "", lastName: "", email: "", username: "", newPassword: ""
    });

    // cible token
    const getToken = () => {
        const local = localStorage.getItem("capy_token");
        if (local && local !== "null" && local !== "undefined") {
            return local;
        }
        return sessionStorage.getItem("capy_token");
    };

    // recupere data
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.error("Aucun token trouvé, impossible de charger le profil admin.");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(prev => ({
                        ...prev,
                        firstName: data.member.firstname || "",
                        lastName: data.member.lastname || "",
                        email: data.member.email || "",
                        username: data.member.username || ""
                    }));
                }
            } catch (error) {
                console.error("Erreur profil admin:", error);
            }
        };
        fetchAdminProfile();
    }, []);

    const handleChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // send modif
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken(); // <-- Appel de la fonction
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        try {
            // maj profil
            await fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ firstname: profileData.firstName, lastname: profileData.lastName })
            });

            // Requête 2: Mise à jour du compte (email, pseudo)
            await fetch(`${import.meta.env.VITE_API_URL}/api/members/me/account`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ email: profileData.email, username: profileData.username })
            });

            // mdp
            if (profileData.newPassword) {
                await fetch(`${import.meta.env.VITE_API_URL}/api/members/me/password`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ password: profileData.newPassword })
                });
            }

            alert("Profil Admin mis à jour avec succès !");
            setProfileData(prev => ({ ...prev, newPassword: "" }));
        } catch (error) {
            console.error("Erreur maj admin:", error);
        }
    };

    return { profileData, handleChange, handleSubmit };
}