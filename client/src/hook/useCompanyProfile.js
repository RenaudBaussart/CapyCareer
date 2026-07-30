// fichier gerant logique page profil entreprise

// import
import { useState, useEffect } from "react";

export function useCompanyProfile() {
    const [profileData, setProfileData] = useState({
        companyName: "",
        email: "",
        description: ""
    });

    // 💡 ciblage du token
    const getToken = () => {
        const local = localStorage.getItem("capy_token");
        if (local && local !== "null" && local !== "undefined") {
            return local;
        }
        return sessionStorage.getItem("capy_token");
    };

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.error("Aucun token trouvé, impossible de charger le profil entreprise.");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        companyName: data.member.username || "",
                        email: data.member.email || "",
                        description: data.member.biography || ""
                    });
                }
            } catch (error) {
                console.error("Erreur profil entreprise:", error);
            }
        };

        fetchCompanyProfile();
    }, []);

    const handleChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        try {
            // update profil
            await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ biography: profileData.description })
            });

            // update info
            await fetch(`${import.meta.env.VITE_API_URL}/members/me/account`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ email: profileData.email, username: profileData.companyName })
            });

            alert("Profil Entreprise mis à jour !");
        } catch (error) {
            console.error("Erreur validation entreprise:", error);
        }
    };

    return { profileData, handleChange, handleSubmit };
}