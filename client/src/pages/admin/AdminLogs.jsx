// fichier gerant la page de consultation & purge logs systeme

// import
import { useAdminLogs } from "../../hook/useAdminLogs";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import LogDataGrid from "../../components/admin/LogDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
// icone
import { Search, Terminal, Trash2, ShieldAlert } from "lucide-react";

export default function AdminLogs() {
    // call le hook (datas, fonctions)
    const {
        logs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDelete,
        requestPurge,
        executeAction
    } = useAdminLogs();

    // config modale
    const modalContentMap = {
        delete: {
            title: "Supprimer cette entrée ?",
            message: "Ce log sera effacé de l'historique de manière permanente.",
            confirmText: "Oui, supprimer",
            icon: Trash2,
            btnColor: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
            iconBg: "text-red-600 bg-red-100"
        },
        purge: {
            title: "Purger tous les logs ?",
            message: "ATTENTION : Vous êtes sur le point de vider intégralement l'historique du système. Cette action est irréversible.",
            confirmText: "Oui, tout purger",
            icon: ShieldAlert,
            btnColor: "bg-red-600 hover:bg-red-700 shadow-red-600/40",
            iconBg: "text-red-100 bg-red-600"
        }
    };

    // cible la config
    const currentModal = modalConfig.actionType ? modalContentMap[modalConfig.actionType] : {};

    return (
        <div
            className="bg-main-layout flex flex-col min-h-screen">
            <MainNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-5 sm:p-8 md:p-10 w-full flex-1 flex flex-col">

                    {/* haut de page (recherche) */}
                    <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-font-primary-dark flex items-center gap-2 sm:gap-3">
                                <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
                                <span className="truncate">Journaux Système (Logs)</span>
                            </h1>
                            <p className="text-deep-primary mt-1 max-w-xl text-sm sm:text-base">
                                Surveillez l'activité de la plateforme, les erreurs d'API N8N et les événements critiques de sécurité.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                              {/* btn purger SIL y a des logs */}
                            {logs.length > 0 && (
                                <button
                                    onClick={requestPurge}
                                    className="px-4 py-2 bg-red-100/80 text-red-600 hover:bg-red-200 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-red-200/50 whitespace-nowrap"
                                >
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                    Tout purger
                                </button>
                            )}

                            
                            {/* recherche */}
                            <div className="relative w-full sm:w-64 md:w-72">
                                <input
                                    type="text"
                                    placeholder="Rechercher un événement..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark placeholder-primary-dark/50 transition-all"
                                />
                                <Search className="w-5 h-5 text-font-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>

                    {/* tableau logs */}
                    <div className="bg-bone-light/40 rounded-2xl p-2 border border-white/50 flex-1">
                        <LogDataGrid
                            logs={logs}
                            handleDelete={requestDelete}
                        />
                    </div>

                </div>
            </main>

            {/* modale */}
            <AdminActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={executeAction}

                title={currentModal.title}
                message={currentModal.message}
                confirmText={currentModal.confirmText}
                icon={currentModal.icon}
                confirmBtnClass={currentModal.btnColor}
                iconColorClass={currentModal.iconBg}
            />
        </div>
    );
}
