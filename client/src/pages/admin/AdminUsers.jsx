// fichier gerant la page de moderation des utilisateurs (liste, bannissement, suppression)

// import
import { useAdminUsers } from "../../hook/useAdminUsers";
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
import UserDataGrid from "../../components/admin/UseDataGrid";
import AdminActionModal from "../../components/admin/modals/AdminActionModal";
import Leaves from "../../assets/images/Leaves.png";
// icone
import { Search, Users, Ban, Trash2 } from "lucide-react";

export default function AdminUsers() {
    // call le hook 
    const {
        users,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestBanUser,
        requestDeleteUser,
        executeAction
    } = useAdminUsers();

    // config dynamique (text, color modale selon action)
    const isBanAction = modalConfig.actionType === 'ban';

    return (
        <div
            className="min-h-screen bg-bone text-primary-dark flex flex-col font-sans"
            style={{
                backgroundImage: `url(${Leaves})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100%"
            }}
        >
            <AdminNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1 flex flex-col">

                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-primary-dark flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                Modération Utilisateurs
                            </h1>
                            <p className="text-deep-primary mt-1">
                                Recherchez, bloquez ou supprimez des comptes pour maintenir la sécurité.
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Rechercher par email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark placeholder-primary-dark/50 transition-all"
                            />
                            <Search className="w-5 h-5 text-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="bg-white/40 rounded-2xl p-2 border border-white/50 flex-1">
                        <UserDataGrid
                            users={users}
                            // transmet ces fonctions a la grille via des props
                            handleBanUser={requestBanUser}
                            handleDeleteUser={requestDeleteUser}
                        />
                    </div>

                </div>
            </main>

            {/* modale */}
            <AdminActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={executeAction}

                // props dynamiques selon action
                title={isBanAction ? "Bannir cet utilisateur ?" : "Supprimer définitivement ?"}
                message={isBanAction
                    ? "L'utilisateur ne pourra plus se connecter. Cette action est réversible."
                    : "Toutes les données de l'utilisateur seront effacées. Cette action est irréversible."
                }
                confirmText={isBanAction ? "Oui, bannir" : "Oui, supprimer"}
                icon={isBanAction ? Ban : Trash2}

                confirmBtnClass={isBanAction
                    ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
                    : "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                }
                iconColorClass={isBanAction
                    ? "text-orange-600 bg-orange-100"
                    : "text-red-600 bg-red-100"
                }
            />
        </div>
    );
}