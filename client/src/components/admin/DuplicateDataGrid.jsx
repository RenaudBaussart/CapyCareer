// fichier gerant le composant de la liste/tableau des doublons detectés
// WARNING: voir pertinence

// import
// icone
import { Trash2, Check } from "lucide-react";

export default function DuplicateDataGrid({ duplicates, handleKeep, handleDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/40 text-font-primary-dark/70 text-sm">
                        <th className="py-4 px-4 font-semibold">Poste suspect</th>
                        <th className="py-4 px-4 font-semibold">Entreprise</th>
                        <th className="py-4 px-4 font-semibold">Confiance IA</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {duplicates.length > 0 ? (
                        duplicates.map((dup) => (
                            <tr 
                                key={dup.id} 
                                className="border-b border-white/20 hover:bg-bone-light/30 transition-colors"
                            >
                                <td className="py-4 px-4 font-medium text-font-primary-dark">
                                    <div className="flex items-center gap-2">
                                        {dup.title}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-font-primary-dark/80 flex items-center gap-2">
                                    {dup.company}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${
                                        dup.confidence >= 90 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {dup.confidence}% de certitude
                                    </span>
                                </td>
                                <td className="py-4 px-4 flex justify-end gap-2">
                                    {/* btn conserver (faux positif) */}
                                    <button 
                                        onClick={() => handleKeep(dup.id)}
                                        title="Faux positif : Valider l'offre"
                                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    
                                    {/* btn supprimer (vrai doublon) */}
                                    <button 
                                        onClick={() => handleDelete(dup.id)}
                                        title="Vrai doublon : Supprimer l'offre"
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-8 text-center text-font-primary-dark/60">
                                Aucun doublon à traiter pour le moment.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}