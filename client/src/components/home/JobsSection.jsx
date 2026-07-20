// fichier du component fil d'offres (recherche + liste + detail)

// import
import { useMemo, useState } from "react";
// icone
import { Search, MapPin, Bookmark, Share2, Briefcase, Sparkles } from "lucide-react";

/* affichage */

function formatLocation(job) {
    if (job.city && job.country) return `${job.city}, ${job.country}`;
    return job.city || job.country || "Localisation non précisée";
}

function getWorkMode(job) {
    if (job.remote) return "Télétravail";
    if (job.hybrid) return "Hybride";
    return "Sur site";
}

function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
}


/* badge type de contrat */

const BADGE_STYLES = {
    CDI: "bg-accent/15 text-accent-dark",
    CDD: "bg-orange-100 text-orange-700",
    Stage: "bg-primary-light/20 text-primary-dark",
    Alternance: "bg-primary/15 text-primary-dark",
};

function Badge({ label }) {
    if (!label) return null;
    const style = BADGE_STYLES[label] || "bg-primary-light/10 text-primary-dark";
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
            {label}
        </span>
    );
}

/* carte liste offres */

function JobCard({ job, isSelected, isSaved, onSelect, onToggleSave }) {
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
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-semibold text-sm leading-snug text-primary-dark">{job.title}</p>
                    <p className="text-xs mt-0.5 text-primary-dark/60">{job.company}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5 text-primary-dark/60">
                        <MapPin size={11} aria-hidden="true" /> {formatLocation(job)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave();
                    }}
                    className="p-1.5 shrink-0 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre"}
                    aria-pressed={isSaved}
                >
                    <Bookmark
                        size={14}
                        fill={isSaved ? "currentColor" : "none"}
                        className={isSaved ? "text-accent-dark" : "text-primary-dark"}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div className="mt-3">
                <Badge label={job.contract_type} />
            </div>
        </div>
    );
}

/*detail offre selectionnée */

function JobDetail({ job, isSaved, onToggleSave }) {
    return (
        <article className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-primary-dark">{job.title}</h2>
                    <p className="mt-1 font-medium text-primary-dark/70">{job.company}</p>
                    <p className="text-sm mt-0.5 flex items-center gap-1 text-primary-dark/70">
                        <MapPin size={14} aria-hidden="true" /> {formatLocation(job)}
                    </p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onToggleSave}
                        className="p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre"}
                        aria-pressed={isSaved}
                    >
                        <Bookmark
                            size={17}
                            fill={isSaved ? "currentColor" : "none"}
                            className={isSaved ? "text-accent-dark" : "text-primary-dark"}
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Partager l'offre"
                    >
                        <Share2 size={17} className="text-primary-dark" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <Badge label={job.contract_type} />
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-bone text-primary-dark/70">
                    {getWorkMode(job)}
                </span>
            </div>

            <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-bone text-sm font-semibold px-5 py-2.5 rounded-xl mt-5 hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark"
            >
                Postuler — Voir l'offre sur {job.source || "le site"}
            </a>

            <div className="mt-7 pt-6 border-t border-primary-light/30">
                <h3 className="flex items-center gap-2 font-semibold text-primary-dark mb-2">
                    <Briefcase size={16} aria-hidden="true" /> Détails de l'emploi
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm mb-5">
                    <dt className="text-primary-dark/60">Entreprise</dt>
                    <dd className="font-medium text-primary-dark">{job.company}</dd>
                    <dt className="text-primary-dark/60">Lieu</dt>
                    <dd className="font-medium text-primary-dark">{formatLocation(job)}</dd>
                </dl>
                <h3 className="font-semibold text-primary-dark mb-2">Description du poste</h3>
                <p className="text-sm leading-relaxed text-primary-dark/70 whitespace-pre-line">
                    {truncate(job.description, 500)}
                </p>
            </div>
        </article >
    );
}

/* section principale */

export default function JobsSection({ jobs }) {
    const [query, setQuery] = useState("");
    const [lieu, setLieu] = useState("");
    const [selectedId, setSelectedId] = useState(jobs[0]?.source_id ?? null);
    const [saved, setSaved] = useState(() => new Set());

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const l = lieu.trim().toLowerCase();
        return jobs.filter((job) => {
            const matchQ = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
            const matchL = !l || formatLocation(job).toLowerCase().includes(l);
            return matchQ && matchL;
        });
    }, [jobs, query, lieu]);

    const selected = filtered.find((j) => j.source_id === selectedId) || filtered[0] || null;

    function toggleSave(id) {
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <div className="mt-10">

            <div className="flex items-start gap-3 mb-3">
                <h2 className="text-2xl font-bold text-primary-dark pt-1">Fil d'offres</h2>
            </div>

            {/* barre de recherche */}
            <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-3 mb-10 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Search size={18} className="text-primary-dark/50 shrink-0" aria-hidden="true" />
                    <label htmlFor="job-query" className="sr-only">Intitulé de poste, mots clés</label>
                    <input
                        id="job-query"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Intitulé de poste, mots clés..."
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-primary-dark/40"
                    />
                </div>

                <div className="hidden sm:block w-px h-6 bg-primary-light/50 shrink-0" aria-hidden="true" />
                <div className="sm:hidden border-t border-primary-light/30" aria-hidden="true" />

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MapPin size={18} className="text-primary-dark/50 shrink-0" aria-hidden="true" />
                    <label htmlFor="job-location" className="sr-only">Localisation</label>
                    <input
                        id="job-location"
                        type="text"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        placeholder="Localisation"
                        className="flex-1 min-w-0 sm:w-40 bg-transparent outline-none text-sm placeholder:text-primary-dark/40"
                    />
                </div>

                <button
                    type="button"
                    className="w-full sm:w-auto bg-primary text-bone font-bold text-sm px-5 py-2 rounded-xl hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none shrink-0"
                >
                    Rechercher
                </button>
            </div>

            {/* liste des offres & détails */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
                <aside aria-label="Liste des offres">
                    <h3 className="flex items-center gap-2 font-bold text-primary-dark mb-3">
                        <Sparkles size={16} className="text-primary" aria-hidden="true" /> Emplois recommandés
                    </h3>
                    <div className="flex flex-col gap-3 overflow-auto max-h-150 scrollbar-thumb-primary-dark rounded-2xl">
                        {filtered.map((job) => (
                            <JobCard
                                key={job.source_id}
                                job={job}
                                isSelected={selected?.source_id === job.source_id}
                                isSaved={saved.has(job.source_id)}
                                onSelect={() => setSelectedId(job.source_id)}
                                onToggleSave={() => toggleSave(job.source_id)}
                            />
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-sm text-center py-6 text-primary-dark/60">Aucun résultat.</p>
                        )}
                    </div>
                </aside>

                {selected ? (
                    <JobDetail
                        job={selected}
                        isSaved={saved.has(selected.source_id)}
                        onToggleSave={() => toggleSave(selected.source_id)}
                    />
                ) : (
                    <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-10 flex flex-col items-center text-center gap-3">
                        <p className="font-semibold text-primary-dark">Aucune offre ne correspond</p>
                        <p className="text-sm text-primary-dark/60">Essaie d'élargir ta recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}