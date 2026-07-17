// fichier gerant logique & actions de la page des logs systeme admin

// import
import { useState } from "react";

export function useAdminLogs() {
    // WARNING: vraies datas a mettre
    const mockLogs = [
        { id: 1, type: "erreur", message: "Erreur API N8N (Rate Limit 429)", date: "16/07/2026 14:32" },
        { id: 2, type: "info", message: "Connexion administrateur réussie", date: "16/07/2026 10:15" },
        { id: 3, type: "alerte", message: "Tentative de connexion échouée (IP suspecte)", date: "15/07/2026 22:45" },
        { id: 4, type: "info", message: "Synchronisation WeLoveDevs terminée", date: "15/07/2026 08:00" },
    ];

    const [logs, setLogs] = useState(mockLogs);
    const [searchQuery, setSearchQuery] = useState("");

    // etat modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    // stocke quelle action ciblé & quel log
    const [modalConfig, setModalConfig] = useState({ actionType: null, logId: null });

    // filtrer par message
    const filteredLogs = logs.filter((log) =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // en cas ede suppression
    const requestDelete = (logId) => {
        setModalConfig({ actionType: 'delete', logId });
        setIsModalOpen(true);
    };

    // en cas de purge
    const requestPurge = () => {
        setModalConfig({ actionType: 'purge', logId: null });
        setIsModalOpen(true);
    };

    // execution SI confirmation
    const executeAction = () => {
        if (modalConfig.actionType === 'delete') {
            setLogs(logs.filter(log => log.id !== modalConfig.logId));
        } else if (modalConfig.actionType === 'purge') {
            setLogs([]);
        }
    };

    // return
    return {
        logs: filteredLogs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDelete,
        requestPurge,
        executeAction
    };
}