// fichier gerant logique page profil candidat

import { useState, useEffect } from "react";

export function useUserProfile() {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        biography: ""
    });

    // etat modale
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // etat save
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // etat rgpd
    const [isGdprModalOpen, setIsGdprModalOpen] = useState(false);
    const [isLoadingGdpr, setIsLoadingGdpr] = useState(false);
    const [gdprData, setGdprData] = useState(null);

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
                if (!token) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
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

    // logique pour la save (ouvre modale lors de submit)
    const requestSaveProfile = (e) => {
        e.preventDefault();
        setIsSaveModalOpen(true);
    };

    // requete api lors confirmation
    const executeSaveProfile = async () => {
        setIsSaving(true);
        const token = getToken();
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    firstname: profileData.firstName,
                    lastname: profileData.lastName,
                    biography: profileData.biography
                })
            });

            await fetch(`${import.meta.env.VITE_API_URL}/members/me/account`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    email: profileData.email,
                    username: profileData.username
                })
            });

            // Ferme la modale une fois terminé
            setIsSaving(false);
            setIsSaveModalOpen(false);

        } catch (error) {
            console.error("Erreur API de validation:", error);
            setIsSaving(false);
        }
    };

    const handleCVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Fichier CV sélectionné :", file.name);
        }
    };

    const disableNotifications = () => {
        console.log("Demande de désactivation des notifications");
    };

    // logique rgpd

    const requestGdprData = async () => {
        setIsGdprModalOpen(true);
        setIsLoadingGdpr(true);

        try {
            const token = getToken();
            if (!token) return;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setGdprData(data);
            } else {
                setGdprData({ erreur: "Impossible de récupérer les données." });
            }
        } catch (error) {
            console.error("Erreur récupération données RGPD:", error);
            setGdprData({ erreur: "Erreur serveur." });
        } finally {
            setIsLoadingGdpr(false);
        }
    };

    const downloadGdprData = () => {
        if (!gdprData) return;

        // conversion objet en json
        const dataStr = JSON.stringify(gdprData, null, 2);

        // creation fichier virtuel
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // creation lien fantome pour le dl du fichier
        const link = document.createElement("a");
        link.href = url;
        link.download = `capycareer_rgpd_donnees_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();

        // clean
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // logique de suppression
    const requestAccountDeletion = () => {
        setIsDeleteModalOpen(true);
    };

    const executeAccountDeletion = async () => {
        setIsDeleting(true);
        try {
            const token = getToken();

            if (!token) {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/members/me`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                localStorage.removeItem("capy_token");
                localStorage.removeItem("capy_user");
                sessionStorage.removeItem("capy_token");
                sessionStorage.removeItem("capy_user");
                window.location.replace("/");
            } else {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Erreur suppression de compte", error);
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return {
        profileData, handleChange, handleCVUpload, disableNotifications,
        requestAccountDeletion, isDeleteModalOpen, setIsDeleteModalOpen, executeAccountDeletion, isDeleting,
        requestSaveProfile, isSaveModalOpen, setIsSaveModalOpen, executeSaveProfile, isSaving,
        isGdprModalOpen, setIsGdprModalOpen, requestGdprData, downloadGdprData, gdprData, isLoadingGdpr
    };
}