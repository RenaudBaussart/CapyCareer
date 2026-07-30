// fichier gerant le hook de la synchronisation n8n

import { useState, useEffect } from "react";

export function useN8nSync() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncStatus, setLastSyncStatus] = useState("success");
    const [lastSyncTime, setLastSyncTime] = useState(null);

    // fonction qui recupere la date de dernier refresh
    const fetchLastSync = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/last-sync`);
            if (response.ok) {
                const data = await response.json();
                setLastSyncTime(data.last_sync);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la dernière synchro :", error);
        }
    };

    // charge la date au lancement de la page
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLastSync();
    }, []);

    const triggerSync = async () => {
        setIsSyncing(true);
        setLastSyncStatus("idle");

        try {
            // cibler la route refresh pour les offres
            const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            setLastSyncStatus("success");
            // Rafraîchir la date après une synchro réussie
            await fetchLastSync();
        } catch (error) {
            console.error("Erreur lors de la synchronisation avec n8n :", error);
            setLastSyncStatus("error");
        } finally {
            setIsSyncing(false);
        }
    };

    return { isSyncing, lastSyncStatus, lastSyncTime, triggerSync };
}