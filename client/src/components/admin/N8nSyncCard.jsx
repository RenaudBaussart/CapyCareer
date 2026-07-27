// import
import { useN8nSync } from "../../hook/useN8nSync";

// icone
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function N8nSyncCard() {
  // call le hook (recupere datas, etat, & date de dernier refresh)
  const { isSyncing, lastSyncStatus, lastSyncTime, triggerSync } = useN8nSync();

  // fonction qui formate la date
  const formatLastSync = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-deep-primary mb-4 flex items-center gap-2">
        État de la Collecte des Offres
      </h2>

      <div className="bg-bone-light/70 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-white/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-font-primary-dark">Pipeline N8N - Source : WeLoveDevs</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-deep-primary">Dernière synchronisation :</span>
            {lastSyncStatus === "success" && (
              <span className="flex items-center gap-1 text-font-primary-dark font-medium">
                <CheckCircle2 className="w-4 h-4" /> Réussie {lastSyncTime ? `(${formatLastSync(lastSyncTime)})` : ""}
              </span>
            )}
            {lastSyncStatus === "error" && (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <AlertCircle className="w-4 h-4" /> Échec
              </span>
            )}
            {isSyncing && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <RefreshCw className="w-4 h-4 animate-spin" /> En cours...
              </span>
            )}
          </div>
        </div>

        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className={`flex items-center bg-deep-primary gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 ${isSyncing
              ? "bg-deep-primary cursor-not-allowed"
              : "bg-deep-primary hover:bg-primary-dark shadow-lg hover:shadow-primary/20"
            }`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Collecte en cours..." : "Forcer la relance"}
        </button>
      </div>
    </section>
  );
}