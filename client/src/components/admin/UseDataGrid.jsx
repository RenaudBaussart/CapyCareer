// fichier gérant le tableau/grille des utilisateurs

// import
import { Ban, ShieldCheck, Mail } from "lucide-react";
// component
import Pagination from "../ui/Pagination";

export default function UserDataGrid({
    users,
    activeTab,
    handleBanUser,
    handleUnbanUser,
    searchQuery,
    currentPage,
    setCurrentPage,
    isTheEnd
}) {
    const StatusBadge = () => (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${activeTab === 'actifs' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
            {activeTab === 'actifs' ? <ShieldCheck className="w-3 h-3 shrink-0" aria-hidden="true" /> : <Ban className="w-3 h-3 shrink-0" aria-hidden="true" />}
            {activeTab === 'actifs' ? 'Actif' : 'Banni'}
        </span>
    );

    const ActionButton = ({ user }) =>
        activeTab === 'actifs' ? (
            <button
                onClick={() => handleBanUser(user)}
                aria-label={`Bannir ${user.name}`}
                title={`Bannir ${user.name}`}
                className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors shrink-0"
            >
                <Ban className="w-4 h-4" aria-hidden="true" />
            </button>
        ) : (
            <button
                onClick={() => handleUnbanUser(user)}
                aria-label={`Débannir ${user.name}`}
                title={`Débannir ${user.name}`}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shrink-0"
            >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </button>
        );

    const emptyMessage = activeTab === 'actifs'
        ? (searchQuery ? "Aucun utilisateur trouvé avec cette adresse email." : "Aucun utilisateur actif enregistré pour le moment.")
        : (searchQuery ? "Aucun utilisateur banni trouvé avec cette recherche." : "Aucun utilisateur banni.");

    return (
        <div className="flex-1 flex flex-col justify-between">

            {/* ---- vue mobile : cartes empilées (< sm) ---- */}
            <div className="sm:hidden flex flex-col gap-3">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user.id || user.email}
                            className="bg-bone-light/60 border border-white/50 rounded-xl p-4 flex flex-col gap-2"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="font-medium text-font-primary-dark truncate">{user.name}</p>
                                    <div className="flex items-center gap-1.5 text-sm text-font-primary-dark/70 min-w-0">
                                        <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                                <ActionButton user={user} />
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-1">
                                <span className="text-sm text-font-primary-dark/80">{user.role}</span>
                                <StatusBadge />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-8 text-center text-font-primary-dark/60">{emptyMessage}</p>
                )}
            </div>

            {/* ---- vue tableau (sm et plus) ---- */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse table-fixed" aria-label="Liste des utilisateurs">
                    <thead>
                        <tr className="border-b border-white/40 text-font-primary-dark/70 text-sm">
                            <th scope="col" className="py-4 px-4 font-semibold w-[28%]">Utilisateur</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[30%]">Email</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[16%]">Rôle</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[14%]">Statut</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[12%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id || user.email} className="border-b border-white/20 hover:bg-bone-light/30 transition-colors">
                                    <th scope="row" className="py-4 px-4 font-medium text-font-primary-dark truncate" title={user.name}>
                                        <span className="truncate block">{user.name}</span>
                                    </th>
                                    <td className="py-4 px-4 text-font-primary-dark truncate" title={user.email}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Mail className="w-4 h-4 text-font-primary-dark/50 shrink-0" aria-hidden="true" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-font-primary-dark/80 truncate" title={user.role}>
                                        <span className="truncate block">{user.role}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-start gap-2">
                                            <ActionButton user={user} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-font-primary-dark/60">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* composant pagination (masqué si recherche active) */}
            {(!searchQuery && (users.length > 0 || currentPage > 0) && setCurrentPage && isTheEnd !== undefined) && (
                <Pagination
                    currentPage={currentPage}
                    isTheEnd={isTheEnd}
                    onPrevPage={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    onNextPage={() => setCurrentPage(prev => prev + 1)}
                />
            )}
        </div>
    );
}