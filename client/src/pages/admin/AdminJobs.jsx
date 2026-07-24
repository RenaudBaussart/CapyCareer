// fichier gerant la page de moderation des offres d'emploi (liste, recherche, pagination et suppression)

// import
import { useAdminJobs } from "../../hook/useAdminJobs";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import JobDataGrid from "../../components/admin/JobDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
import Pagination from "../../components/ui/Pagination";
// icone
import { Search, Briefcase, Trash2 } from "lucide-react";

export default function AdminJobs() {
    // call le hook (datas, fonctions, pagination & total)
    const {
        jobs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDeleteJob,
        handleEditJob,
        executeAction,
        isLoading,
        currentPage,
        setCurrentPage,
        isTheEnd,
        totalJobsCount
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
    };

    // recupere config selon action
    const currentModal = modalConfig.actionType ? modalContentMap[modalConfig.actionType] : {};

    return (
        <div className="bg-main-layout flex flex-col min-h-screen">
            {/* navbar globale */}
            <MainNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1 flex flex-col">

                    {/* haut de page (titre + compteur + recherche) */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            {/* titre avec badge du nombre total d'offres */}
                            <h1 className="text-3xl font-bold text-font-primary-dark flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                Modération des Offres
                                {totalJobsCount > 0 && (
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                        {totalJobsCount} actives
                                    </span>
                                )}
                            </h1>
                            <p className="text-deep-primary mt-1">
                                Gérez les annonces, corrigez les erreurs ou supprimez les offres obsolètes.
                            </p>
                        </div>

                        {/* barre de recherche component */}
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Rechercher une offre..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark placeholder-primary-dark/50 transition-all"
                            />
                            <Search className="w-5 h-5 text-font-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* tableau des offres et pagination */}
                    <div className="bg-bone-light/40 rounded-2xl p-2 border border-white/50 flex-1 flex flex-col">
                        {isLoading ? (
                            <div className="p-8 text-center text-font-primary-dark/60 flex-1 flex items-center justify-center">
                                Chargement des offres...
                            </div>
                        ) : (
                            <>
                                <JobDataGrid
                                    jobs={jobs}
                                    handleEditJob={handleEditJob}
                                    handleDeleteJob={requestDeleteJob}
                                    searchQuery={searchQuery}
                                />

                                {/* pagination component (masqué si recherche active) */}
                                {(!searchQuery && (jobs.length > 0 || currentPage > 0)) && (
                                    <Pagination
                                        currentPage={currentPage}
                                        isTheEnd={isTheEnd}
                                        onPrevPage={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        onNextPage={() => setCurrentPage(prev => prev + 1)}
                                    />
                                )}
                            </>
                        )}
                    </div>

                </div>
            </main>

            {/* modale action */}
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