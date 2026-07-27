// fichier gerant la page de moderation des doublons (detectés via IA)
// WARNING : voir la pertinence de cette page 

// import
import { useAdminDuplicates } from "../../hook/useAdminDuplicates";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import DuplicateDataGrid from "../../components/admin/DuplicateDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
// icone
import { Search, CopyPlus, Trash2, Check } from "lucide-react";

export default function AdminDuplicates() {
    // call le hook (datas, fonctions)
    const { 
        duplicates, 
        searchQuery, 
        setSearchQuery, 
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestKeep,
        requestDelete,
        executeAction
    } = useAdminDuplicates();

    // config modale
    const modalContentMap = {
        keep: {
            title: "Valider comme annonce unique ?",
            message: "Cette offre sera marquée comme 'faux positif' et restera visible sur la plateforme.",
            confirmText: "Oui, conserver",
            icon: Check,
            btnColor: "bg-green-500 hover:bg-green-600 shadow-green-500/30",
            iconBg: "text-green-600 bg-green-100"
        },
        delete: {
            title: "Supprimer ce doublon ?",
            message: "Cette offre sera supprimée car elle est considérée comme un duplicata d'une annonce existante.",
            confirmText: "Oui, supprimer",
            icon: Trash2,
            btnColor: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
            iconBg: "text-red-600 bg-red-100"
        }
    };

    // recupere config selon action
    const currentModal = modalConfig.actionType ? modalContentMap[modalConfig.actionType] : {};

    return (
        <div 
            className="bg-main-layout">
            <MainNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1 flex flex-col">
                    
                    {/* haut de page (recherche) */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-font-primary-dark flex items-center gap-3">
                                <CopyPlus className="w-8 h-8 text-primary" />
                                Gestion des Doublons
                            </h1>
                            <p className="text-deep-primary mt-1">
                                Vérifiez les offres signalées par l'IA. Conservez les faux positifs ou supprimez les doublons.
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <input 
                                type="text"
                                placeholder="Rechercher une offre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark placeholder-primary-dark/50 transition-all"
                            />
                            <Search className="w-5 h-5 text-font-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* tableau doublons */}
                    <div className="bg-bone-light/40 rounded-2xl p-2 border border-white/50 flex-1">
                        <DuplicateDataGrid 
                            duplicates={duplicates} 
                            handleKeep={requestKeep}
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