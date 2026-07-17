// fichier gerant la logique et les actions de la page utilisateurs admin

// import
import { useState } from "react";

export function useAdminUsers() {
    // WARNING: vraies datas à mettre
    const mockUsers = [
        { id: 1, name: "Jean Dupont", email: "jean.dupont@epitech.eu", role: "Candidat", status: "actif", date: "2026-05-12" },
        { id: 2, name: "Alice Entreprise", email: "contact@elosi.fr", role: "Entreprise", status: "actif", date: "2026-06-01" },
        { id: 3, name: "Spammer Bot", email: "spam@scam.com", role: "Candidat", status: "banni", date: "2026-07-10" },
    ];

    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState("");

    // etat modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    // stocke quelle action ciblé & quel user
    const [modalConfig, setModalConfig] = useState({ actionType: null, userId: null });

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // en cas du clic user, prepare la modale
    const requestBanUser = (userId) => {
        setModalConfig({ actionType: 'ban', userId });
        setIsModalOpen(true);
    };

    const requestDeleteUser = (userId) => {
        setModalConfig({ actionType: 'delete', userId });
        setIsModalOpen(true);
    };

    // si confirme alors
    const executeAction = () => {
        // execute action
        if (modalConfig.actionType === 'ban') {
            setUsers(users.map(user =>
                user.id === modalConfig.userId ? { ...user, status: "banni" } : user
            ));
        } else if (modalConfig.actionType === 'delete') {
            setUsers(users.filter(user => user.id !== modalConfig.userId));
        }
    };

    // return info modale
    return {
        users: filteredUsers,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestBanUser,
        requestDeleteUser,
        executeAction
    };
}