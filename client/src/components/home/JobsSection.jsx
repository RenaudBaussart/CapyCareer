// fichier du component fil d'offres (recherche + liste + detail)

// import
import { useEffect, useMemo, useRef, useState } from "react";
import { useSavedJobs } from "../../hook/useSavedJobs";
// icone
import { Search, MapPin, Bookmark, Share2, Briefcase, Sparkles, X, Tag, Apple, Banana, Citrus } from "lucide-react";


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

/* tag filtrable (type de contrat) */

function TagChip({ label, isActive, onToggle }) {
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

/* tag mot-clé libre (avec bouton de suppression) */

function KeywordChip({ label, onRemove }) {
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

/* saisie libre pour ajouter des mots-clés (front-end, back-end, etc.) */

function KeywordTagInput({ keywords, onAddKeyword, onRemoveKeyword }) {
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
                        onToggleSave();
                    }}
                    className="p-1.5 shrink-0 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre"}
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

            <div className="mt-3">
                <Badge label={job.contract_type} />
            </div>
        </div>
    );
}

/*detail offre selectionnée */

// onClose n'est utilisé que sur mobile (bouton fermeture de la modal plein écran)
function JobDetail({ job, isSaved, onToggleSave, onClose }) {
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
                        onClick={onToggleSave}
                        className="p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={isSaved ? "Retirer des offres sauvegardées" : "Sauvegarder l'offre"}
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
                        className="p-2 rounded-full hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Partager l'offre"
                    >
                        <Share2 size={17} className="text-font-primary-dark" aria-hidden="true" />
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
                className="inline-block bg-primary text-light text-sm font-semibold px-5 py-2.5 rounded-xl mt-5 hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark"
            >
                Postuler — Voir l'offre
            </a>

            <div className="mt-7 pt-6 border-t border-primary-light/30">
                <h3 className="flex items-center gap-2 font-semibold text-font-primary-dark mb-2">
                    <Briefcase size={16} aria-hidden="true" /> Détails de l'emploi
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm mb-5">
                    <dt className="text-font-primary-dark/60">Entreprise</dt>
                    <dd className="font-medium text-font-primary-dark">{job.company}</dd>
                    <dt className="text-font-primary-dark/60">Lieu</dt>
                    <dd className="font-medium text-font-primary-dark">{formatLocation(job)}</dd>
                </dl>
                <h3 className="font-semibold text-font-primary-dark mb-2">Description du poste</h3>
                <p className="text-sm leading-relaxed text-font-primary-dark/70 whitespace-pre-line">
                    {truncate(job.description, 500)}
                </p>
            </div>
        </article >
    );
}

/* section principale */

export default function JobsSection({ fetchJobOffers, fetchJobOfferDetail }) {
    const [query, setQuery] = useState("");
    const [lieu, setLieu] = useState("");
    // tags de type de contrat sélectionnés pour filtrer (Set de contract_type)
    const [selectedTags, setSelectedTags] = useState(() => new Set());
    // mots-clés libres tapés par l'utilisateur pour filtrer (ex: "Front-end", "React"...)
    const [keywords, setKeywords] = useState([]);

    // liste légère issue de la route listing
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(0);
    const [isEnd, setIsEnd] = useState(true);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [listError, setListError] = useState(null);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState(null);

    const [mode, setMode] = useState("feed");
    const [savedDetails, setSavedDetails] = useState([]);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [savedError, setSavedError] = useState(null);

    // évite de refetch si loffre a déjà été consultée
    const detailsCache = useRef(new Map());
    const { saved, toggleSave } = useSavedJobs();

    // pilote l'affichage de la modal plein écran en mobile (n'a pas d'effet en desktop)
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

    // empêche le scroll de la page tant que la modal mobile est ouverte (ignoré en desktop, où il n'y a pas de modal)
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1023px)"); // en dessous du breakpoint lg de Tailwind

        // applique ou retire le blocage de scroll selon l'état de la modal ET la taille d'écran actuelle
        function updateScrollLock() {
            if (isMobileDetailOpen && mediaQuery.matches) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }

        updateScrollLock();
        // réagit si l'utilisateur redimensionne la fenêtre pendant que la modal est ouverte
        mediaQuery.addEventListener("change", updateScrollLock);

        return () => {
            mediaQuery.removeEventListener("change", updateScrollLock);
            document.body.style.overflow = "";
        };
    }, [isMobileDetailOpen]);


    // récupère la première page d'offres au montage
    useEffect(() => {
        let cancelled = false;
        setIsLoadingList(true);
        setListError(null);

        fetchJobOffers({ page: 0 })
            .then((data) => {
                if (cancelled) return;
                setJobs(data.job_offers);
                setIsEnd(data.is_the_end);
                setPage(0);
            })
            .catch((err) => {
                if (cancelled) return;
                setListError(err.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingList(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fetchJobOffers]);

    // charge le détail de chaque offre sauvegardée quand on ouvre l'onglet "saved"
    useEffect(() => {
        if (mode !== "saved") return;
        if (saved.size === 0) {
            setSavedDetails([]);
            setSavedError(null);
            return;
        }

        let cancelled = false;
        setIsLoadingSaved(true);
        setSavedError(null);

        const ids = Array.from(saved);

        Promise.allSettled(
            ids.map((id) => {
                const cached = detailsCache.current.get(id);
                if (cached) return Promise.resolve(cached);
                return fetchJobOfferDetail(id).then((data) => {
                    detailsCache.current.set(id, data);
                    return data;
                });
            })
        ).then((results) => {
            if (cancelled) return;
            const ok = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
            const failedCount = results.length - ok.length;
            setSavedDetails(ok);
            // certaines offres sauvegardées peuvent avoir été supprimées côté back depuis
            setSavedError(failedCount > 0 ? `${failedCount} offre(s) sauvegardée(s) ne sont plus disponibles.` : null);
        }).finally(() => {
            if (!cancelled) setIsLoadingSaved(false);
        });

        return () => {
            cancelled = true;
        };
    }, [mode, saved, fetchJobOfferDetail]);

    // liste des types de contrat réellement présents dans les offres chargées (pas de doublons)
    const availableTags = useMemo(() => {
        return Array.from(
            new Set(
                jobs
                    .map((job) => job.contract_type)
                    .filter(Boolean)
            )
        );
    }, [jobs]);

    // ajoute/retire un tag de la sélection
    function toggleTag(tag) {
        setSelectedTags((prev) => {
            const next = new Set(prev);
            next.has(tag) ? next.delete(tag) : next.add(tag);
            return next;
        });
    }

    // ajoute un mot-clé libre (évite les doublons, insensible à la casse)
    function addKeyword(keyword) {
        setKeywords((prev) => {
            const alreadyExists = prev.some((k) => k.toLowerCase() === keyword.toLowerCase());
            if (alreadyExists) return prev;
            return [...prev, keyword];
        });
    }

    // retire un mot-clé libre
    function removeKeyword(keyword) {
        setKeywords((prev) => prev.filter((k) => k !== keyword));
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const l = lieu.trim().toLowerCase();
        return jobs.filter((job) => {
            const matchQ = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
            const matchL = !l || formatLocation(job).toLowerCase().includes(l);
            // aucun tag sélectionné = pas de filtre ; sinon l'offre doit correspondre à l'un des tags actifs
            const matchTags = selectedTags.size === 0 || selectedTags.has(job.contract_type);
            // aucun mot-clé = pas de filtre ; sinon le titre doit contenir au moins un des mots-clés (OR)
            const matchKeywords =
                keywords.length === 0 ||
                keywords.some((keyword) => job.title.toLowerCase().includes(keyword.toLowerCase()));
            return matchQ && matchL && matchTags && matchKeywords;
        });
    }, [jobs, query, lieu, selectedTags, keywords]);

    // liste effectivement affichée selon l'onglet actif
    const visibleJobs = mode === "feed" ? filtered : savedDetails;

    // ajuste la sélection quand les résultats affichés changent
    useEffect(() => {
        if (visibleJobs.length === 0) {
            setSelectedId(null);
            return;
        }

        const stillVisible = visibleJobs.some(
            (job) => job.PK_id === selectedId
        );

        if (!stillVisible) {
            setSelectedId(visibleJobs[0].PK_id);
        }
    }, [visibleJobs, selectedId]);

    // récupère le détail de l'offre sélectionnée (avec cache)
    useEffect(() => {
        if (selectedId == null) {
            setSelectedDetail(null);
            return;
        }

        const cached = detailsCache.current.get(selectedId);
        if (cached) {
            setSelectedDetail(cached);
            return;
        }

        let cancelled = false;
        setIsLoadingDetail(true);
        setDetailError(null);

        fetchJobOfferDetail(selectedId)
            .then((data) => {
                if (cancelled) return;
                detailsCache.current.set(selectedId, data);
                setSelectedDetail(data);
            })
            .catch((err) => {
                if (cancelled) return;
                setDetailError(err.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingDetail(false);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedId, fetchJobOfferDetail]);

    // sélectionne une offre depuis la liste et ouvre la modal (mobile uniquement, ignoré en desktop)
    function handleSelectJob(id) {
        setSelectedId(id);
        setIsMobileDetailOpen(true);
    }

    // charge la page suivante d'offres
    function loadMore() {
        const nextPage = page + 1;
        setIsLoadingList(true);
        fetchJobOffers({ page: nextPage })
            .then((data) => {
                setJobs((prev) => [...prev, ...data.job_offers]);
                setIsEnd(data.is_the_end);
                setPage(nextPage);
            })
            .catch((err) => setListError(err.message))
            .finally(() => setIsLoadingList(false));
    }

    return (
        <div className="mt-10">

            <div className="flex items-start gap-3 mb-3">
                <h2 className="text-2xl font-bold text-font-primary-dark pt-1">Fil d'offres</h2>
            </div>

            {/* onglets */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setMode("feed")}
                    aria-pressed={mode === "feed"}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${mode === "feed"
                        ? "bg-primary text-light"
                        : "bg-bone-light text-font-primary-dark hover:bg-primary-light/10"
                        }`}
                >
                    Fil d'offres
                </button>
                <button
                    type="button"
                    onClick={() => setMode("saved")}
                    aria-pressed={mode === "saved"}
                    className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${mode === "saved"
                        ? "bg-primary text-light"
                        : "bg-bone-light text-font-primary-dark hover:bg-primary-light/10"
                        }`}
                >
                    <Bookmark size={14} fill={mode === "saved" ? "currentColor" : "none"} aria-hidden="true" />
                    Offres sauvegardées
                    {saved.size > 0 && (
                        <span className={`text-xs rounded-full px-1.5 ${mode === "saved" ? "bg-light/20" : "bg-primary/15 text-primary"}`}>
                            {saved.size}
                        </span>
                    )}
                </button>
            </div>

            {mode === "feed" && (
                <>
                    {/* barre de recherche */}
                    <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-3 mb-4 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Search size={18} className="text-font-primary-dark/50 shrink-0" aria-hidden="true" />

                            <label htmlFor="job-query" className="sr-only">Intitulé de poste, mots clés</label>
                            <input
                                id="job-query"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Intitulé de poste, mots clés..."
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-font-primary-dark/40"
                            />
                        </div>

                        <div className="hidden sm:block w-px h-6 bg-primary-light/50 shrink-0" aria-hidden="true" />
                        <div className="sm:hidden border-t border-primary-light/30" aria-hidden="true" />

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <MapPin size={18} className="text-font-primary-dark/50 shrink-0" aria-hidden="true" />
                            <label htmlFor="job-location" className="sr-only">Localisation</label>
                            <input
                                id="job-location"
                                type="text"
                                value={lieu}
                                onChange={(e) => setLieu(e.target.value)}
                                placeholder="Localisation"
                                className="flex-1 min-w-0 sm:w-40 bg-transparent outline-none text-sm placeholder:text-font-primary-dark/40"
                            />
                        </div>

                        <button
                            type="button"
                            className="w-full sm:w-auto bg-primary text-light font-bold text-sm px-5 py-2 rounded-xl hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none shrink-0"
                        >
                            Rechercher
                        </button>
                    </div>

                    {/* mots-clés libres (front-end, back-end...) */}
                    <div className="mb-4">
                        <KeywordTagInput
                            keywords={keywords}
                            onAddKeyword={addKeyword}
                            onRemoveKeyword={removeKeyword}
                        />
                    </div>
                </>
            )}

            {listError && (
                <p className="text-sm text-accent-dark mb-4">Impossible de charger les offres : {listError}</p>
            )}

            {/* liste des offres & détails */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
                <aside aria-label="Liste des offres">
                    <h3 className="flex items-center gap-2 font-bold text-font-primary-dark mb-3">
                        <Sparkles size={16} className="text-primary" aria-hidden="true" /> Emplois recommandés
                    </h3>
                    <div className="flex flex-col gap-3 overflow-auto max-h-150 scrollbar-auto md:scrollbar-thumb-primary-dark lg:scrollbar-thumb-primary-dark rounded-2xl box-border">
                        {visibleJobs.map((job) => (
                            <JobCard
                                key={job.PK_id}
                                job={job}
                                isSelected={selectedId === job.PK_id}
                                isSaved={saved.has(job.PK_id)}
                                onSelect={() => handleSelectJob(job.PK_id)}
                                onToggleSave={() => toggleSave(job.PK_id)}
                            />
                        ))}

                        {mode === "feed" && !isLoadingList && visibleJobs.length === 0 && (
                            <p className="text-sm text-center py-6 text-font-primary-dark/60">Aucun résultat.</p>
                        )}

                        {mode === "saved" && !isLoadingSaved && visibleJobs.length === 0 && (
                            <p className="text-sm text-center py-6 text-font-primary-dark/60">
                                Tu n'as pas encore sauvegardé d'offre. Clique sur l'icône 🔖 sur une offre pour la retrouver ici.
                            </p>
                        )}

                        {mode === "feed" && isLoadingList && (
                            <>
                                <p className="text-sm text-center py-6 text-font-primary-dark">Chargement des offres...</p>
                                <div className="flex items-center gap-4 justify-center text-3xl">
                                    <Apple className="animate-bounce" aria-hidden="true" />
                                    <Citrus className="animate-bounce [animation-delay:100ms]" aria-hidden="true" />
                                    <Banana className="animate-bounce [animation-delay:200ms]" aria-hidden="true" />
                                </div>
                            </>
                        )}

                        {mode === "saved" && isLoadingSaved && (
                            <p className="text-sm text-center py-6 text-font-primary-dark">Chargement des offres sauvegardées...</p>
                        )}

                        {mode === "saved" && savedError && (
                            <p className="text-xs text-center text-accent-dark">{savedError}</p>
                        )}

                        {mode === "feed" && !isEnd && !isLoadingList && (
                            <button
                                type="button"
                                onClick={loadMore}
                                className="text-sm font-semibold text-primary py-2 hover:underline"
                            >
                                Voir plus d'offres
                            </button>
                        )}
                    </div>
                </aside>

                {/*
                  colonne détail : toujours visible en desktop.
                  En mobile : elle est masquée par défaut et devient une modal plein écran
                */}
                <div
                    className={`${isMobileDetailOpen ? "fixed inset-0 z-50 bg-bone overflow-y-auto p-4" : "hidden"} lg:static lg:z-auto lg:bg-transparent lg:p-0 lg:block lg:overflow-visible`}
                >
                    {isLoadingDetail && (
                        <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-10 flex flex-col items-center text-center gap-3">
                            <p className="text-sm text-font-primary-dark">Chargement de l'offre...</p>
                            <>
                                <div className="flex items-center gap-4 justify-center text-3xl">
                                    <Apple className="animate-bounce" aria-hidden="true" />
                                    <Citrus className="animate-bounce [animation-delay:100ms]" aria-hidden="true" />
                                    <Banana className="animate-bounce [animation-delay:200ms]" aria-hidden="true" />
                                </div>
                            </>
                        </div>
                    )}

                    {!isLoadingDetail && detailError && (
                        <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-10 flex flex-col items-center text-center gap-3">
                            <p className="font-semibold text-font-primary-dark">Impossible de charger cette offre</p>
                            <p className="text-sm text-font-primary-dark/60">{detailError}</p>
                        </div>
                    )}

                    {!isLoadingDetail && !detailError && selectedDetail && (
                        <JobDetail
                            job={selectedDetail}
                            isSaved={saved.has(selectedDetail.PK_id)}
                            onToggleSave={() => toggleSave(selectedDetail.PK_id)}
                            onClose={() => setIsMobileDetailOpen(false)}
                        />
                    )}

                    {!isLoadingDetail && !detailError && !selectedDetail && visibleJobs.length === 0 && (
                        <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-10 flex flex-col items-center text-center gap-3">
                            <p className="font-semibold text-font-primary-dark">
                                {mode === "feed" ? "Aucune offre ne correspond" : "Aucune offre sauvegardée"}
                            </p>
                            <p className="text-sm text-font-primary-dark/60">
                                {mode === "feed" ? "Essaie d'élargir ta recherche." : "Sauvegarde une offre pour la retrouver ici."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}