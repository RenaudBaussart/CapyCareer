// fichier du component fil d'offres (recherche + liste + detail)

import { useJobsFeed } from "../../hook/useJobsFeed";
import { Search, MapPin, Bookmark, Sparkles, Apple, Banana, Citrus } from "lucide-react";
import { JobCard, JobDetail, KeywordTagInput } from "./JobsSection.parts";

// section principale

export default function JobsSection({ fetchJobOffers, fetchJobOfferDetail }) {
    const {
        query, setQuery,
        lieu, setLieu,
        keywords, addKeyword, removeKeyword,
        isLoadingList, listError, isEnd, loadMore,
        visibleJobs,
        selectedId, selectedDetail, isLoadingDetail, detailError,
        handleSelectJob,
        mode, setMode,
        isLoadingSaved, savedError,
        saved, toggleSave,
        isMobileDetailOpen, setIsMobileDetailOpen,
    } = useJobsFeed({ fetchJobOffers, fetchJobOfferDetail });

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