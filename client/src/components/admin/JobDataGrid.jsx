// fichier gerant le composant de la liste/tableau des offres d'emploi

// import
import { Trash2, Pencil, Globe } from "lucide-react";

export default function JobDataGrid({ jobs, handleEditJob, handleDeleteJob, searchQuery }) {

    const emptyMessage = searchQuery
        ? "Aucun résultat trouvé pour cette recherche."
        : "Aucune offre d'emploi enregistrée pour le moment.";

    const SourceBadge = ({ job }) => (
        job.url ? (
            <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Voir l'offre originale"
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 max-w-full truncate transition-all hover:underline cursor-pointer ${job.source === 'CapyCareer'
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
            >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{job.source}</span>
            </a>
        ) : (
            <span
                title="Lien non disponible"
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 max-w-full truncate opacity-70 cursor-default ${job.source === 'CapyCareer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                    }`}
            >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{job.source}</span>
            </span>
        )
    );

    const ActionButtons = ({ job }) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleEditJob(job.PK_id)}
                title="Modifier l'offre"
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDeleteJob(job.PK_id)}
                title="Supprimer l'offre"
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    if (jobs.length === 0) {
        return (
            <div className="py-8 text-center text-font-primary-dark/60">
                {emptyMessage}
            </div>
        );
    }

    return (
        <>
            {/* vue mobile : cartes (< sm) */}
            <div className="sm:hidden flex flex-col gap-3">
                {jobs.map((job) => (
                    <div
                        key={job.PK_id}
                        className="bg-bone-light/60 border border-white/50 rounded-xl p-4 flex flex-col gap-2"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-medium text-font-primary-dark wrap-break-word">
                                    {/* ajout id vue mobile */}
                                    <span className="text-font-primary-dark/50 font-mono text-sm mr-2">#{job.PK_id}</span>
                                    {job.title}
                                </p>
                                <p className="text-sm text-font-primary-dark/70 truncate">{job.company}</p>
                            </div>
                            <ActionButtons job={job} />
                        </div>
                        <div>
                            <SourceBadge job={job} />
                        </div>
                    </div>
                ))}
            </div>

            {/* vue tableau (sm & plus) */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-160 text-left border-collapse table-fixed">
                    <thead>
                        <tr className="border-b border-white/40 text-font-primary-dark/70 text-sm">
                            {/* en tete ID */}
                            <th className="py-4 px-4 font-semibold w-[10%]">ID</th>
                            <th className="py-4 px-4 font-semibold w-[40%]">Poste</th>
                            <th className="py-4 px-4 font-semibold w-[22%]">Entreprise</th>
                            <th className="py-4 px-4 font-semibold w-[14%]">Source</th>
                            <th className="py-4 px-4 font-semibold w-[14%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr
                                key={job.PK_id}
                                className="border-b border-white/20 hover:bg-bone-light/30 transition-colors"
                            >
                                {/* ID offre */}
                                <td className="py-4 px-4 text-font-primary-dark/60 font-mono text-sm">
                                    {job.PK_id}
                                </td>
                                <td className="py-4 px-4 font-medium text-font-primary-dark truncate" title={job.title}>
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="truncate">{job.title}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-font-primary-dark/80 truncate" title={job.company}>
                                    <span className="truncate">{job.company}</span>
                                </td>
                                <td className="py-4 px-4 truncate">
                                    <SourceBadge job={job} />
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-start gap-2">
                                        <ActionButtons job={job} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}