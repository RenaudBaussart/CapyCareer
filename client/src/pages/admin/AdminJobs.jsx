// fichier gerant la page de moderation des offres (liste, edition, suppression)

// import
import { useAdminJobs } from "../../hook/useAdminJobs";
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
import JobDataGrid from "../../components/admin/JobDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
import Leaves from "../../assets/images/Leaves.png";
// icone
import { Search, Briefcase, Trash2 } from "lucide-react";

export default function AdminJobs() {
    // call le hook (datas, fonctions)
    const {
        jobs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDeleteJob,
        handleEditJob,
        executeAction
    } = useAdminJobs();

    // conf modale
    const modalContentMap = {
        delete: {
            title: "Supprimer cette offre ?",
            message: "Cette annonce sera retirée de la plateforme. Cette action est irréversible.",
            confirmText: "Oui, supprimer l'offre",
            icon: Trash2,
            btnColor: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
            iconBg: "text-red-600 bg-red-100"
        }
        // WARNING : voir pour archive, validée
    };

    // recupere config selon action
    const currentModal = modalConfig.actionType ? modalContentMap[modalConfig.actionType] : {};

    return (
        <div className="bg-main-layout">
            <AdminNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1 flex flex-col">

                    {/* haut de page (recherche) */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-primary-dark flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                Modération des Offres
                            </h1>
                            <p className="text-deep-primary mt-1">
                                Gérez les annonces, corrigez les erreurs ou supprimez les offres obsolètes.
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Rechercher une offre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark placeholder-primary-dark/50 transition-all"
                            />
                            <Search className="w-5 h-5 text-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* tableau doffres */}
                    <div className="bg-white/40 rounded-2xl p-2 border border-white/50 flex-1">
                        <JobDataGrid
                            jobs={jobs}
                            handleEditJob={handleEditJob}
                            handleDeleteJob={requestDeleteJob}
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