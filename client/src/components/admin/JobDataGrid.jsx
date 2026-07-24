// fichier gerant le composant de la liste/tableau des offres d emploi

// import
// icone
import { Trash2, Pencil, Globe, CheckCircle, EyeOff } from "lucide-react";

export default function JobDataGrid({ jobs, handleEditJob, handleDeleteJob }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/40 text-font-primary-dark/70 text-sm">
                        <th className="py-4 px-4 font-semibold">Poste</th>
                        <th className="py-4 px-4 font-semibold">Entreprise</th>
                        <th className="py-4 px-4 font-semibold">Source</th>
                        <th className="py-4 px-4 font-semibold">Statut</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <tr
                                key={job.PK_id}
                                className="border-b border-white/20 hover:bg-bone-light/30 transition-colors"
                            >
                                <td className="py-4 px-4 font-medium text-font-primary-dark">
                                    <div className="flex items-center gap-2">
                                        {job.title}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-font-primary-dark/80 flex items-center gap-2">
                                    {job.company}
                                </td>
                                <td className="py-4 px-4">
                                    {/* pastille de source */}
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${job.source === 'CapyCareer'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        <Globe className="w-3 h-3" />
                                        {job.source}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${job.status === 'actif'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {job.status === 'actif' ? <CheckCircle className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {job.status === 'actif' ? 'Actif' : 'Obsolète'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 flex justify-end gap-2">
                                    {/* btn editer (desactivé si externe) */}
                                    <button
                                        onClick={() => handleEditJob(job.PK_id)}
                                        disabled={job.source !== 'CapyCareer'}
                                        title={job.source !== 'CapyCareer' ? "Modification interdite (source externe)" : "Modifier l'offre"}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>

                                    {/* btn supprimer */}
                                    <button
                                        onClick={() => handleDeleteJob(job.PK_id)}
                                        title="Supprimer l'offre"
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-8 text-center text-font-primary-dark/60">
                                Aucune offre trouvée avec cette recherche.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}