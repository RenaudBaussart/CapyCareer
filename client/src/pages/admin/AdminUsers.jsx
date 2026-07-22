// fichier gérant la page de modération des candidats

// import
import { useAdminUsers } from "../../hook/useAdminUsers";
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
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
        <div className="bg-main-layout">
            <AdminNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1 flex flex-col">

                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            {/* titre selon role */}
                            <h1 className="text-3xl font-bold text-primary-dark flex items-center gap-3">
                                {isCandidate ? <Users className="w-8 h-8 text-primary" aria-hidden="true" /> : <Building className="w-8 h-8 text-primary" aria-hidden="true" />}
                                Modération {isCandidate ? "Candidats" : "Entreprises"}
                            </h1>
                            <p className="text-deep-primary mt-1">
                                Recherchez, bloquez ou débloquez des comptes {isCandidate ? "candidats" : "recruteurs"} pour maintenir la sécurité.
                            </p>
                        </div>

                        {/* recherche component */}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder="Rechercher par email..."
                        />
                    </div>

                    {/* gestion des onglets */}
                    <div className="flex gap-4 mb-4 border-b border-white/40">
                        <button
                            onClick={() => setActiveTab("actifs")}
                            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'actifs' ? 'text-primary border-b-2 border-primary' : 'text-primary-dark/60 hover:text-primary-dark'}`}
                        >
                            Comptes Actifs
                        </button>
                        <button
                            onClick={() => setActiveTab("bannis")}
                            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'bannis' ? 'text-red-500 border-b-2 border-red-500' : 'text-primary-dark/60 hover:text-primary-dark'}`}
                        >
                            Comptes Bannis
                        </button>
                    </div>

                    <div className="bg-white/40 rounded-2xl p-2 border border-white/50 flex-1">
                        <UserDataGrid
                            users={users}
                            activeTab={activeTab}
                            handleBanUser={requestBanUser}
                            handleUnbanUser={requestUnbanUser}
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