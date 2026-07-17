// fichier gerant logique page profil candidat
// WARNING: api à call

// import
import { useState } from "react";

export function useUserProfile() {
    // etats initiaux du profil
    const [profileData, setProfileData] = useState({
        firstName: "Sarah",
        lastName: "Ploye",
        email: "sarah@mail.fr",
        phone: "0606060606",
        location: "Lille",
        github: "",
        portfolio: "",
        status: "Recherche d'alternance"
    });

    // gestion champs text
    const handleChange = (e) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // gestion btn de validation
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Validation du profil Candidat:", profileData);
        // WARNING: remplacer par fetch API
    };

    // gestion upload CV
    const handleCVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Fichier CV sélectionné :", file.name);
            // WARNING: logique à faire si ajout validé sinon à supprimer
        }
    };

    // actions zone dangereuse
    const disableNotifications = () => {
        console.log("Demande de désactivation des notifications");
    };

    const requestAccountDeletion = () => {
        console.log("Demande de suppression du compte");
        // WARNING: modale a faire
    };

    return {
        profileData,
        handleChange,
        handleSubmit,
        handleCVUpload,
        disableNotifications,
        requestAccountDeletion
    };
}