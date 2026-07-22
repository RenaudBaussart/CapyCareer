// fichier gerant le tableau/grille des users

// import
import { Ban, ShieldCheck, Mail } from "lucide-react";

export default function UserDataGrid({ users, activeTab, handleBanUser, handleUnbanUser }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Liste des utilisateurs">
                <thead>
                    <tr className="border-b border-white/40 text-primary-dark/70 text-sm">
                        <th scope="col" className="py-4 px-4 font-semibold">Utilisateur</th>
                        <th scope="col" className="py-4 px-4 font-semibold">Email</th>
                        <th scope="col" className="py-4 px-4 font-semibold">Statut</th>
                        <th scope="col" className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id || user.email} className="border-b border-white/20 hover:bg-white/30 transition-colors">

                                <th scope="row" className="py-4 px-4 font-medium text-primary-dark">
                                    {user.name}
                                </th>
                                <td className="py-4 px-4 text-primary-dark">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary-dark/50" aria-hidden="true" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${activeTab === 'actifs' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {activeTab === 'actifs' ? <ShieldCheck className="w-3 h-3" aria-hidden="true" /> : <Ban className="w-3 h-3" aria-hidden="true" />}
                                        {activeTab === 'actifs' ? 'Actif' : 'Banni'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 flex justify-end gap-2">

                                    {/* btn ban ou unban selon l'onglet (on passe tout le user) */}
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
                            <td colSpan="4" className="py-8 text-center text-primary-dark/60">
                                {activeTab === 'actifs' 
                                    ? "Aucun utilisateur trouvé avec cette adresse email." 
                                    : "Aucun utilisateur banni."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}