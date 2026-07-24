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
    return (
        <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed" aria-label="Liste des utilisateurs">
                    <thead>
                        <tr className="border-b border-white/40 text-font-primary-dark/70 text-sm">
                            <th scope="col" className="py-4 px-4 font-semibold w-[30%]">Utilisateur</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[32%]">Email</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[16%]">Rôle</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[12%]">Statut</th>
                            <th scope="col" className="py-4 px-4 font-semibold w-[10%]">Actions</th>
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
                                        <div className="flex items-center gap-2 truncate">
                                            <Mail className="w-4 h-4 text-font-primary-dark/50 shrink-0" aria-hidden="true" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-font-primary-dark/80 truncate" title={user.role}>
                                        <span className="truncate block">{user.role}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${activeTab === 'actifs' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {activeTab === 'actifs' ? <ShieldCheck className="w-3 h-3 shrink-0" aria-hidden="true" /> : <Ban className="w-3 h-3 shrink-0" aria-hidden="true" />}
                                            {activeTab === 'actifs' ? 'Actif' : 'Banni'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 flex justify-start gap-2">

                                        {/* btn ban ou unban selon l'onglet */}
                                        {activeTab === 'actifs' ? (
                                            <button
                                                onClick={() => handleBanUser(user)}
                                                aria-label={`Bannir ${user.name}`}
                                                title={`Bannir ${user.name}`}
                                                className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                                            >
                                                <Ban className="w-4 h-4" aria-hidden="true" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnbanUser(user)}
                                                aria-label={`Débannir ${user.name}`}
                                                title={`Débannir ${user.name}`}
                                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                            >
                                                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>

                                <td colSpan="5" className="py-8 text-center text-font-primary-dark/60">
                                    {activeTab === 'actifs' ? (
                                        searchQuery ? (
                                            "Aucun utilisateur trouvé avec cette adresse email."
                                        ) : (
                                            "Aucun utilisateur actif enregistré pour le moment."
                                        )
                                    ) : (
                                        searchQuery ? (
                                            "Aucun utilisateur banni trouvé avec cette recherche."
                                        ) : (
                                            "Aucun utilisateur banni."
                                        )
                                    )}
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