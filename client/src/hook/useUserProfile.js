// fichier gerant logique page profil candidat

// import
import { useState, useEffect } from "react";

export function useUserProfile() {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        biography: ""
    });

    // cible token
    const getToken = () => {
        const local = localStorage.getItem("capy_token");
        if (local && local !== "null" && local !== "undefined") {
            return local;
        }
        return sessionStorage.getItem("capy_token");
    };

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.error("Aucun token trouvé, impossible de charger le profil.");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        firstName: data.member.firstname || "",
                        lastName: data.member.lastname || "",
                        email: data.member.email || "",
                        username: data.member.username || "",
                        biography: data.member.biography || ""
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du profil:", error);
            }
        };

        fetchMyProfile();
    }, []);

    const handleChange = (e) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        try {
            // update profile
            await fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    firstname: profileData.firstName,
                    lastname: profileData.lastName,
                    biography: profileData.biography
                })
            });

            // update info compte
            await fetch(`${import.meta.env.VITE_API_URL}/api/members/me/account`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    email: profileData.email,
                    username: profileData.username
                })
            });

            alert("Profil Candidat mis à jour !");
        } catch (error) {
            console.error("Erreur API de validation:", error);
        }
    };

    const handleCVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Fichier CV sélectionné :", file.name);
            // WARNING: logique d'upload
        }
    };

    const disableNotifications = () => {
        console.log("Demande de désactivation des notifications");
    };

    // integration route DELETE
    const requestAccountDeletion = async () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.");
        if (!confirmDelete) return;

        try {
            const token = getToken();

            if (!token) {
                alert("Erreur : Aucun token trouvé. Veuillez vous reconnecter.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                alert("Votre compte a bien été supprimé.");
                localStorage.removeItem("capy_token");
                sessionStorage.removeItem("capy_token");
                window.location.href = "/";
            } else {
                const data = await response.json();
                alert(`Erreur lors de la suppression : ${data.message || "Action refusée"}`);
            }
        } catch (error) {
            console.error("Erreur suppression de compte", error);
        }
    };

    return { profileData, handleChange, handleSubmit, handleCVUpload, disableNotifications, requestAccountDeletion };
}