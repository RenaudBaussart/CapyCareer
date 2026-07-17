// fichier du component panneau des candidatures pour une offre sélectionnée

// import
import { CheckCircle2, XCircle, Clock, Mail, Users } from "lucide-react";

/* badge statut candidature */

const STATUS_CONFIG = {
    pending: { label: "En attente", style: "bg-primary-light/20 text-primary-dark", Icon: Clock },
    accepted: { label: "Accepté", style: "bg-accent/15 text-accent-dark", Icon: CheckCircle2 },
    rejected: { label: "Refusé", style: "bg-orange-100 text-orange-700", Icon: XCircle },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const { label, style, Icon } = config;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
            <Icon size={12} aria-hidden="true" />
            {label}
        </span>
    );
}

/* liste candidats */

function ApplicantRow({ applicant, onUpdateStatus }) {
    return (
        <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-primary-light/30 last:border-none">
            <div className="min-w-0">
                <p className="font-semibold text-sm text-primary-dark">{applicant.name}</p>
                <p className="text-xs flex items-center gap-1 mt-0.5 text-primary-dark/60">
                    <Mail size={11} aria-hidden="true" /> {applicant.email}
                </p>
                <p className="text-xs mt-0.5 text-primary-dark/50">
                    Candidature reçue le {applicant.appliedAt}
                </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={applicant.status} />

                {applicant.status === "pending" && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onUpdateStatus(applicant.id, "accepted")}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/15 text-accent-dark hover:bg-accent/25 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-dark"
                        >
                            Accepter
                        </button>
                        <button
                            type="button"
                            onClick={() => onUpdateStatus(applicant.id, "rejected")}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            Refuser
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}

/* panneau principal */

export default function ApplicantsPanel({ job, onUpdateApplicantStatus }) {
    if (!job) {
        return (
            <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-10 flex flex-col items-center text-center gap-3">
                <Users size={28} className="text-primary-dark/40" aria-hidden="true" />
                <p className="font-semibold text-primary-dark">Sélectionnez une offre</p>
                <p className="text-sm text-primary-dark/60">
                    Choisissez une offre dans la liste pour voir les candidatures reçues.
                </p>
            </div>
        );
    }

    return (
        <article className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-primary" aria-hidden="true" />
                <h3 className="font-bold text-primary-dark">
                    Candidatures — {job.title}
                </h3>
            </div>
            <p className="text-sm text-primary-dark/60 mb-4">
                {job.applicants.length} candidature{job.applicants.length > 1 ? "s" : ""} reçue{job.applicants.length > 1 ? "s" : ""}
            </p>

            {job.applicants.length === 0 ? (
                <p className="text-sm text-center py-8 text-primary-dark/60">
                    Aucune candidature pour le moment.
                </p>
            ) : (
                <ul>
                    {job.applicants.map((applicant) => (
                        <ApplicantRow
                            key={applicant.id}
                            applicant={applicant}
                            onUpdateStatus={(applicantId, status) =>
                                onUpdateApplicantStatus(job.id, applicantId, status)
                            }
                        />
                    ))}
                </ul>
            )}
        </article>
    );
}