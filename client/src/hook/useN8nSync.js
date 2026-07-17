// fichier gerant le hook de la synchronisation n8n

import { useState } from "react";

export function useN8nSync() {
    // indique si une synchro est en cours
    const [isSyncing, setIsSyncing] = useState(false);
    // stocke le dernier etat de la synchro
    const [lastSyncStatus, setLastSyncStatus] = useState("success");

    // fonction appeée pour lancer une synchro
    const triggerSync = async () => {
        // mode chargement
        setIsSyncing(true);
        // reboot le statut avant new synchro
        setLastSyncStatus("idle");

        try {
            // WARNING: call api à mettre
            // const response = await fetch('/api/n8n/sync', { method: 'POST' });

            // fake api
            await new Promise(resolve => setTimeout(resolve, 2500));
            // en cas de reussite
            setLastSyncStatus("success");
        } catch (error) {
            // en cas derreur
            setLastSyncStatus("error");
        } finally {
            // desactive mode chargement peut importe lissu
            setIsSyncing(false);
        }
    };

    return { isSyncing, lastSyncStatus, triggerSync };
}