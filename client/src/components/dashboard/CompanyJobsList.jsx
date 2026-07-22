// fichier du component liste des offres postées par l'entreprise 

// import
import { useState } from "react";
import { MapPin, Users, Pencil, Trash2, Power, Sparkles } from "lucide-react";
import ApplicantsPanel from "./ApplicantsPanel";

/* affichage */

function formatLocation(job) {
    return `${job.city}, ${job.country}`;
}

const BADGE_STYLES = {
    CDI: "bg-accent/15 text-accent-dark",
    CDD: "bg-orange-100 text-orange-700",
    Stage: "bg-primary-light/20 text-font-primary-dark",
    Alternance: "bg-primary/15 text-font-primary-dark",
};

function Badge({ label }) {
    if (!label) return null;
    const style = BADGE_STYLES[label] || "bg-primary-light/10 text-font-primary-dark";
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
            {label}
        </span>
    );
}

/* carte offre */

function CompanyJobCard({ job, isSelected, onSelect, onEdit, onDelete, onToggleStatus }) {
    return (
        <div
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`bg-bone-light rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-primary ${isSelected
                    ? "border-primary shadow-[0_0_15px_rgba(0,0,0,0.15)]"
                    : "border-primary-light/40 shadow-[0_0_15px_rgba(0,0,0,0.06)]"
                } ${job.status === "closed" ? "opacity-60" : ""}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-semibold text-sm leading-snug text-font-primary-dark">{job.title}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5 text-font-primary-dark/60">
                        <MapPin size={11} aria-hidden="true" /> {formatLocation(job)}
                    </p>
                    <p className="text-xs flex items-center gap-1 mt-0.5 text-font-primary-dark/60">
                        <Users size={11} aria-hidden="true" /> {job.applicants.length} candidature
                        {job.applicants.length > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="flex gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus();
                        }}
                        className="p-1.5 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={job.status === "active" ? "Clôturer l'offre" : "Réactiver l'offre"}
                        title={job.status === "active" ? "Clôturer l'offre" : "Réactiver l'offre"}
                    >
                        <Power
                            size={14}
                            className={job.status === "active" ? "text-accent-dark" : "text-font-primary-dark/40"}
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="p-1.5 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Modifier l'offre"
                        title="Modifier l'offre"
                    >
                        <Pencil size={14} className="text-font-primary-dark" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-1.5 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Supprimer l'offre"
                        title="Supprimer l'offre"
                    >
                        <Trash2 size={14} className="text-accent-dark" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
                <Badge label={job.contractType} />
                {job.status === "closed" && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-dark/10 text-font-primary-dark/60">
                        Clôturée
                    </span>
                )}
            </div>
        </div>
    );
}

/* section principale */

export default function CompanyJobsList({ jobs, onEditJob, onDeleteJob, onToggleJobStatus, onUpdateApplicantStatus }) {
    const [selectedId, setSelectedId] = useState(jobs[0]?.id ?? null);
    const selected = jobs.find((j) => j.id === selectedId) || jobs[0] || null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
            <aside aria-label="Liste de vos offres">
                <h3 className="flex items-center gap-2 font-bold text-font-primary-dark mb-3">
                    <Sparkles size={16} className="text-primary" aria-hidden="true" /> Vos offres publiées
                </h3>
                <div className="flex flex-col gap-3 max-h-130 overflow-auto scrollbar-thumb-primary">
                    {jobs.map((job) => (
                        <CompanyJobCard
                            key={job.id}
                            job={job}
                            isSelected={selected?.id === job.id}
                            onSelect={() => setSelectedId(job.id)}
                            onEdit={() => onEditJob(job.id)}
                            onDelete={() => onDeleteJob(job.id)}
                            onToggleStatus={() => onToggleJobStatus(job.id)}
                        />
                    ))}
                    {jobs.length === 0 && (
                        <p className="text-sm text-center py-6 text-font-primary-dark/60">
                            Vous n'avez publié aucune offre pour le moment.
                        </p>
                    )}
                </div>
            </aside>

            <ApplicantsPanel job={selected} onUpdateApplicantStatus={onUpdateApplicantStatus} />
        </div>
    );
}