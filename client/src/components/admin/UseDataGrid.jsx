// fichier gerant le composant de la liste/tableau des utilisateurs

// import
// icone
import { Ban, Trash2, ShieldCheck, Mail } from "lucide-react";

export default function UserDataGrid({ users, handleBanUser, handleDeleteUser }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/40 text-primary-dark/70 text-sm">
                        <th className="py-4 px-4 font-semibold">Utilisateur</th>
                        <th className="py-4 px-4 font-semibold">Email</th>
                        <th className="py-4 px-4 font-semibold">Rôle</th>
                        <th className="py-4 px-4 font-semibold">Statut</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-white/20 hover:bg-white/30 transition-colors"
                            >
                                <td className="py-4 px-4 font-medium text-primary-dark">
                                    {user.name}
                                </td>
                                <td className="py-4 px-4 text-primary-dark flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary-dark/50" />
                                    {user.email}
                                </td>
                                <td className="py-4 px-4 text-primary-dark/80">
                                    {user.role}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${user.status === 'actif'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status === 'actif' ? <ShieldCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                        {user.status === 'actif' ? 'Actif' : 'Banni'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleBanUser(user.id)}
                                        disabled={user.status === 'banni'}
                                        title="Bannir"
                                        className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        title="Supprimer"
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-8 text-center text-primary-dark/60">
                                Aucun utilisateur trouvé avec cette adresse email.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}