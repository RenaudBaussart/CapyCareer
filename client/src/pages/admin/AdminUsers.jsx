// fichier gérant la page de modération des candidats

// import
import { useAdminUsers } from "../../hook/useAdminUsers";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import UserDataGrid from "../../components/admin/UseDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
import SearchBar from "../../components/admin/SearchBar";
// icone
import { Users, Ban, ShieldCheck, Building } from "lucide-react";

// passe le role en prop
export default function AdminUsers({ roleToManage = "candidat" }) {
    const {
        users,
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
    } = useAdminUsers(roleToManage);

    const isBanAction = modalConfig.actionType === 'ban';
    const isCandidate = roleToManage === "candidat";

    return (
        <div className="bg-main-layout flex flex-col min-h-screen">
            <MainNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-4 sm:p-8 md:p-10 w-full flex-1 flex flex-col">

                    <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-font-primary-dark flex items-center gap-2 sm:gap-3">
                                  {/* titre selon role */}
                                {isCandidate ? <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" aria-hidden="true" /> : <Building className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" aria-hidden="true" />}
                                <span className="truncate">Modération {isCandidate ? "Candidats" : "Entreprises"}</span>
                            </h1>
                            <p className="text-deep-primary mt-1 text-sm sm:text-base">
                                Recherchez, bloquez ou débloquez des comptes {isCandidate ? "candidats" : "recruteurs"} pour maintenir la sécurité.
                            </p>
                        </div>

                           {/* recherche component */}
                        <div className="w-full md:w-auto">
                            <SearchBar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                placeholder="Rechercher par email..."
                            />
                        </div>
                    </div>

                    {/* gestion des onglets */}
                    <div className="flex gap-3 sm:gap-4 mb-4 border-b border-white/40 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("actifs")}
                            className={`pb-2 px-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'actifs' ? 'text-primary border-b-2 border-primary' : 'text-font-primary-dark/60 hover:text-font-primary-dark'}`}
                        >
                            Comptes Actifs
                        </button>
                        <button
                            onClick={() => setActiveTab("bannis")}
                            className={`pb-2 px-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'bannis' ? 'text-red-500 border-b-2 border-red-500' : 'text-font-primary-dark/60 hover:text-font-primary-dark'}`}
                        >
                            Comptes Bannis
                        </button>
                    </div>

                    <div className="bg-bone-light/40 rounded-2xl p-2 border border-white/50 flex-1 overflow-x-auto">
                        <UserDataGrid
                            users={users}
                            activeTab={activeTab}
                            handleBanUser={requestBanUser}
                            handleUnbanUser={requestUnbanUser}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>
            </main>

            {/* modale action */}
            <AdminActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={executeAction}
                title={isBanAction ? "Bannir cet utilisateur ?" : "Débannir cet utilisateur ?"}
                message={isBanAction
                    ? "L'utilisateur sera supprimé et placé sur liste noire. Cette action est réversible."
                    : "L'email sera retiré de la liste noire. L'utilisateur devra recréer un compte."
                }
                confirmText={isBanAction ? "Oui, bannir" : "Oui, débannir"}
                icon={isBanAction ? Ban : ShieldCheck}
                confirmBtnClass={isBanAction
                    ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 shadow-orange-500/30"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-600 shadow-green-600/30"
                }
                iconColorClass={isBanAction
                    ? "text-orange-600 bg-orange-100"
                    : "text-green-600 bg-green-100"
                }
            />
        </div>
    );
}
