// fichier gerant logique & actions dashboard utilisateur

// import
import { useState, useEffect } from "react";

export function useAdminUsers(roleToManage) {
    const [users, setUsers] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("actifs");
    const [searchQuery, setSearchQuery] = useState("");

    // etat modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    // stocke objet user pour cibler lemail apres
    const [modalConfig, setModalConfig] = useState({ actionType: null, user: null });

    // recupere users actifs depuis call api
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/members?role=${roleToManage}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("erreur lors de la recuperation");
                const data = await response.json();

                const formattedUsers = data.members.map(m => ({
                    id: m.id,
                    name: m.username || `${m.firstname} ${m.lastname}`,
                    email: m.email,
                    role: m.role,
                    status: 'actif'
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error("erreur api get users:", error);
            }
        };
        fetchUsers();
    }, [roleToManage]);

    // recupere users banned call api
    useEffect(() => {
        const fetchBannedUsers = async () => {
            try {
                const token = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");

                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/banned`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedBanned = data.map(m => ({
                        id: m.PK_banned_id,
                        name: m.username,
                        email: m.email,
                        status: 'banni',
                        banned_at: m.banned_at
                    }));
                    setBannedUsers(formattedBanned);
                }
            } catch (error) {
                console.error("erreur api get banned users:", error);
            }
        };
        fetchBannedUsers();
    }, []);

    // filtre la liste selon l'onglet actif
    const currentList = activeTab === "actifs" ? users : bannedUsers;
    const filteredUsers = currentList.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // en cas du clic user, prepare la modale en passant le user entier
    const requestBanUser = (user) => {
        setModalConfig({ actionType: 'ban', user });
        setIsModalOpen(true);
    };

    const requestUnbanUser = (user) => {
        setModalConfig({ actionType: 'unban', user });
        setIsModalOpen(true);
    };

    // si confirme alors lance call API avec email
    const executeAction = async () => {
        const token = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");
        const targetEmail = modalConfig.user.email;

        try {
            if (modalConfig.actionType === 'ban') {
                // appel api pour ban
                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/members/ban?email=${targetEmail}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Erreur lors du bannissement en BDD");

                // delete des actifs & ajout dans list banned
                setUsers(users.filter(u => u.email !== targetEmail));
                setBannedUsers([...bannedUsers, {
                    id: Date.now(),
                    name: modalConfig.user.name,
                    email: targetEmail,
                    status: 'banni'
                }]);

            } else if (modalConfig.actionType === 'unban') {
                // call api pour unban
                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/members/unban?email=${targetEmail}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Erreur lors du débannissement en BDD");

                // unban
                setBannedUsers(bannedUsers.filter(u => u.email !== targetEmail));
            }
        } catch (error) {
            console.error("Erreur API lors de l'action :", error);
        }
    };

    return {
        users: filteredUsers,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestBanUser,
        requestUnbanUser,
        executeAction
    };
}