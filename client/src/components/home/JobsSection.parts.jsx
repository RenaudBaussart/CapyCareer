// composants d'affichage réutilisés par JobsSection.jsx, regroupés ici pour ne pas multiplier les fichiers

import { useState } from "react";
import { MapPin, Bookmark, Share2, Briefcase, X, Tag, Check } from "lucide-react";


// affichage

export function formatLocation(job) {
    if (job.city && job.country) return `${job.city}, ${job.country}`;
    return job.city || job.country || "Localisation non précisée";
}

export function getWorkMode(job) {
    if (job.remote) return "Télétravail";
    if (job.hybrid) return "Hybride";
    return "Sur site";
}

export function formatSalary(job) {
    const { salary_min, salary_max, currency } = job;

    if (!salary_min && !salary_max) return null;

    const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : (currency || "");

    if (salary_min && salary_max) {
        return `${salary_min.toLocaleString("fr-FR")} - ${salary_max.toLocaleString("fr-FR")} ${currencySymbol}`;
    }

    if (salary_min) return `À partir de ${salary_min.toLocaleString("fr-FR")} ${currencySymbol}`;

    return `Jusqu'à ${salary_max.toLocaleString("fr-FR")} ${currencySymbol}`;
}

export function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
}


// badge type de contrat

const BADGE_STYLES = {
    CDI: "bg-accent/15 text-accent-dark",
    CDD: "bg-orange-100 text-orange-700",
    Stage: "bg-primary-light/20 text-font-primary-dark",
    Alternance: "bg-primary/15 text-font-primary-dark",
};

export function Badge({ label }) {
    if (!label) return null;
    const style = BADGE_STYLES[label] || "bg-primary-light/10 text-font-primary-dark";
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
            {label}
        </span>
    );
}

// tag filtrable

export function TagChip({ label, isActive, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={isActive}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isActive
                ? "bg-primary text-light border-primary"
                : "bg-bone-light text-font-primary-dark border-primary-light/40 hover:bg-primary-light/10"
                }`}
        >
            {label}
        </button>
    );
}

// tag mot-clé

export function KeywordChip({ label, onRemove }) {
    return (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-light">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="hover:opacity-70 transition-opacity focus:outline-none"
                aria-label={`Retirer le mot-clé "${label}"`}
            >
                <X size={12} aria-hidden="true" />
            </button>
        </span>
    );
}

// champs libre pour ajouter des mots-clés

export function KeywordTagInput({ keywords, onAddKeyword, onRemoveKeyword }) {
    const [inputValue, setInputValue] = useState("");

    function handleKeyDown(e) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed) {
                onAddKeyword(trimmed);
                setInputValue("");
            }
        }
        // permet de supprimer le dernier tag avec Backspace si le champ est vide
        if (e.key === "Backspace" && inputValue === "" && keywords.length > 0) {
            onRemoveKeyword(keywords[keywords.length - 1]);
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2 bg-bone-light rounded-2xl border border-primary-light px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors">
            <Tag size={16} className="text-font-primary-dark/50 shrink-0" aria-hidden="true" />

            {keywords.map((keyword) => (
                <KeywordChip
                    key={keyword}
                    label={keyword}
                    onRemove={() => onRemoveKeyword(keyword)}
                />
            ))}

            <label htmlFor="job-keywords" className="sr-only">Ajouter un mot-clé (front-end, back-end...)</label>
            <input
                id="job-keywords"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={keywords.length === 0 ? "Ajouter un mot-clé (front-end, back-end...)" : "Ajouter..."}
                className="flex-1 min-w-32 bg-transparent outline-none text-sm placeholder:text-font-primary-dark/40"
            />
        </div>
    );
}

// carte liste offres

export function JobCard({ job, isSelected, isSaved, isAuthenticated, onSelect, onToggleSave }) {

    const salaryLabel = formatSalary(job);

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
                    <p className="font-semibold text-sm leading-snug text-font-primary-dark">{job.title}</p>
                    <p className="text-xs mt-0.5 text-font-primary-dark/60">{job.company}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5 text-font-primary-dark/60">
                        <MapPin size={11} aria-hidden="true" /> {formatLocation(job)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        // bloque l'enregistrement si non connecté
                        if (!isAuthenticated) return;
                        onToggleSave();
                    }}
                    disabled={!isAuthenticated}
                    className={`p-1.5 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isAuthenticated ? "hover:bg-primary-light/10" : "opacity-40 cursor-not-allowed"}`}
                    aria-label={isAuthenticated ? (isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre") : "Connectez-vous pour enregistrer une offre"}
                    aria-pressed={isSaved}
                >
                    <Bookmark
                        size={14}
                        fill={isSaved ? "currentColor" : "none"}
                        className={isSaved ? "text-accent-dark" : "text-font-primary-dark"}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 mt-3">
                <Badge label={job.contract_type} />
                {salaryLabel && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-deep-primary/10 text-deep-primary">
                        {salaryLabel}
                    </span>
                )}
            </div>
        </div>
    );
}

// detail offre selectionnée

// onClose n'est utilisé que sur mobile 
export function JobDetail({ job, isSaved, isAuthenticated, onToggleSave, onClose }) {
    // etat pour afficher un feedback juste après la copie du lien
    const [isCopied, setIsCopied] = useState(false);

    // copie le lien de l'offre dans le presse-papier
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(job.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Impossible de copier le lien", error);
        }
    };

    return (
        <article className="bg-bone-light rounded-2xl lg:shadow-[0_0_15px_rgba(0,0,0,0.08)] lg:border border-primary-light/40 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-font-primary-dark">{job.title}</h2>
                    <p className="mt-1 font-medium text-font-primary-dark/70">{job.company}</p>
                    <p className="text-sm mt-0.5 flex items-center gap-1 text-font-primary-dark/70">
                        <MapPin size={14} aria-hidden="true" /> {formatLocation(job)}
                    </p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            // bloque l'enregistrement si non connecté
                            if (!isAuthenticated) return;
                            onToggleSave();
                        }}
                        disabled={!isAuthenticated}
                        className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isAuthenticated ? "hover:bg-primary-light/10" : "opacity-40 cursor-not-allowed"}`}
                        aria-label={isAuthenticated ? (isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre") : "Connectez-vous pour enregistrer une offre"}
                        aria-pressed={isSaved}
                    >
                        <Bookmark
                            size={17}
                            fill={isSaved ? "currentColor" : "none"}
                            className={isSaved ? "text-accent-dark" : "text-font-primary-dark"}
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={isCopied ? "Lien copié" : "Partager l'offre"}
                        title={isCopied ? "Lien copié !" : "Copier le lien de l'offre"}
                    >
                        {isCopied ? (
                            <Check size={17} className="text-green-600" aria-hidden="true" />
                        ) : (
                            <Share2 size={17} className="text-font-primary-dark" aria-hidden="true" />
                        )}
                    </button>
                    {/* bouton fermeture, visible uniquement en modal mobile */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Fermer le détail de l'offre"
                    >
                        <X size={17} className="text-font-primary-dark" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <Badge label={job.contract_type} />
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-bone text-font-primary-dark/70">
                    {getWorkMode(job)}
                </span>
            </div>

            <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                // empêche l'ouverture de l'offre si non connecté
                if (!isAuthenticated) e.preventDefault();
            }}
            aria-disabled={!isAuthenticated}
            className={`inline-block text-sm font-semibold px-5 py-2.5 rounded-xl mt-5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark ${isAuthenticated ? "bg-primary text-light hover:bg-primary-dark" : "bg-primary/40 text-light/80 cursor-not-allowed"}`}
            >
            Postuler — Voir l'offre
        </a>
            {
        !isAuthenticated && (
            <p className="text-xs text-font-primary-dark/50 mt-2">Connectez-vous pour postuler à cette offre.</p>
        )
    }

    <div className="mt-7 pt-6 border-t border-primary-light/30">
        <h3 className="flex items-center gap-2 font-semibold text-font-primary-dark mb-2">
            <Briefcase size={16} aria-hidden="true" /> Détails de l'emploi
        </h3>
        <dl className="grid grid-cols-2 gap-y-2 text-sm mb-5">
            <dt className="text-font-primary-dark/60">Entreprise</dt>
            <dd className="font-medium text-font-primary-dark">{job.company}</dd>
            <dt className="text-font-primary-dark/60">Lieu</dt>
            <dd className="font-medium text-font-primary-dark">{formatLocation(job)}</dd>
            <dt className="text-font-primary-dark/60">Salaire</dt>
            <dd className="font-medium text-font-primary-dark">{formatSalary(job) || "Non précisé"}</dd>
        </dl>
        <h3 className="font-semibold text-font-primary-dark mb-2">Description du poste</h3>
        <p className="text-sm leading-relaxed text-font-primary-dark/70 whitespace-pre-line">
            {truncate(job.description, 500)}
        </p>
    </div>
        </article >
    );
}