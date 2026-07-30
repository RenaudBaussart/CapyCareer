// fichier gerant la centralisation & gestion logique metier etat & interactions du fil doffre demploi

import { useEffect, useMemo, useRef, useState } from "react";
import { useSavedJobs } from "./useSavedJobs";
// import { formatLocation } from "../components/home/JobsSection.parts";

// état & logique du fil d'offres (recherche, pagination, sélection, offres sauvegardées)
export function useJobsFeed({ fetchJobOffers, fetchJobOfferDetail }) {
  const [query, setQuery] = useState("");
  const [lieu, setLieu] = useState("");
  // filtres de salaire (min/max)
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  // tags de type de contrat
  const [selectedTags, setSelectedTags] = useState(() => new Set());
  // mots-cles pour filtrer
  const [keywords, setKeywords] = useState([]);

  // valeurs debouncées de la recherche, pour éviter un appel API à chaque frappe
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debouncedLieu, setDebouncedLieu] = useState("");
  const [debouncedSalaryMin, setDebouncedSalaryMin] = useState("");
  const [debouncedSalaryMax, setDebouncedSalaryMax] = useState("");
  const [debouncedKeywords, setDebouncedKeywords] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
      setDebouncedLieu(lieu);
      setDebouncedSalaryMin(salaryMin);
      setDebouncedSalaryMax(salaryMax);
      setDebouncedKeywords(keywords);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, lieu, salaryMin, salaryMax, keywords]);

  // liste légère des offres
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

  // evite de refetch si loffre a déjà été consultée
  const detailsCache = useRef(new Map());
  const { saved, toggleSave, removeSaved } = useSavedJobs();

  // modal plein écran en mobile
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // empêche le scroll de la page si la modal mobile est ouverte
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    // applique ou retire le blocage de scroll selon l'état de la modal
    function updateScrollLock() {
      if (isMobileDetailOpen && mediaQuery.matches) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    updateScrollLock();
    mediaQuery.addEventListener("change", updateScrollLock);

    return () => {
      mediaQuery.removeEventListener("change", updateScrollLock);
      document.body.style.overflow = "";
    };
  }, [isMobileDetailOpen]);

  // récupère la première page d'offres au montage, et à chaque changement de filtre (débouncé)
  useEffect(() => {
    let cancelled = false;
    
    queueMicrotask(() => {
      if (!cancelled) {
        setListError(null);
        setIsLoadingList(true);
      }
    });

    fetchJobOffers({
      page: 0,
      q: debouncedQuery,
      lieu: debouncedLieu,
      salaryMin: debouncedSalaryMin,
      salaryMax: debouncedSalaryMax,
      tags: debouncedKeywords,
    })
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
  }, [
    fetchJobOffers,
    debouncedQuery,
    debouncedLieu,
    debouncedSalaryMin,
    debouncedSalaryMax,
    debouncedKeywords,
  ]);

  // charge le détail de chaque offre sauvegardée si luser ouvre longlet "saved"
  useEffect(() => {
    if (mode !== "saved") return;
    if (saved.size === 0) {
      queueMicrotask(() => {
        setSavedDetails([]);
        setSavedError(null);
      });
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoadingSaved(true);
        setSavedError(null);
      }
    });

    const ids = Array.from(saved);

    Promise.allSettled(
      ids.map((id) => {
        const cached = detailsCache.current.get(id);
        if (cached) return Promise.resolve(cached);
        return fetchJobOfferDetail(id).then((data) => {
          detailsCache.current.set(id, data);
          return data;
        });
      }),
    )
      .then((results) => {
        if (cancelled) return;

        const ok = [];
        const deletedIds = [];
        let otherFailuresCount = 0;

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            ok.push(result.value);
          } else if (result.reason?.message === "Offre introuvable") {
            deletedIds.push(ids[index]);
          } else {
            otherFailuresCount += 1;
          }
        });

        deletedIds.forEach((id) => {
          detailsCache.current.delete(id);
          removeSaved(id);
        });

        setSavedDetails(ok);

        setSavedError(
          otherFailuresCount > 0
            ? `${otherFailuresCount} offre(s) sauvegardée(s) n'ont pas pu être chargées.`
            : null,
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSaved(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, saved, fetchJobOfferDetail, removeSaved]);

  const availableTags = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.contract_type).filter(Boolean)),
    );
  }, [jobs]);

  // liste de tous les tags techniques présents dans les offres chargées (autocomplétion)
  const availableKeywordTags = useMemo(() => {
    const allTags = jobs.flatMap((job) =>
      Array.isArray(job.tag) ? job.tag : [],
    );
    return Array.from(new Set(allTags)).sort();
  }, [jobs]);

  // ajoute/retire un tag de la sélection
  function toggleTag(tag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  // ajoute un mot-clé
  function addKeyword(keyword) {
    setKeywords((prev) => {
      const alreadyExists = prev.some(
        (k) => k.toLowerCase() === keyword.toLowerCase(),
      );
      if (alreadyExists) return prev;
      return [...prev, keyword];
    });
  }

  // retire un mot-clé
  function removeKeyword(keyword) {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  }

  // tag type de contrat reste filtré côté client sur les offres déjà chargées
  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchTags =
        selectedTags.size === 0 || selectedTags.has(job.contract_type);

      return matchTags;
    });
  }, [jobs, selectedTags]);
  
  // liste affichée selon l'onglet actif
  const visibleJobs = mode === "feed" ? filtered : savedDetails;
  
  // ajuste la sélection quand les résultats affichés changent
  useEffect(() => {
    if (visibleJobs.length === 0) {
      if (selectedId !== null) {
        queueMicrotask(() => setSelectedId(null));
      }
      return;
    }

    const stillVisible = visibleJobs.some((job) => job.PK_id === selectedId);

    if (!stillVisible) {
      queueMicrotask(() => setSelectedId(visibleJobs[0].PK_id));
    }
  }, [visibleJobs, selectedId]);

  // recup detail offre ciblée
  useEffect(() => {
    if (selectedId == null) {
      queueMicrotask(() => setSelectedDetail(null));
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

  // cible une offre sur la liste & ouvre modale
  function handleSelectJob(id) {
    setSelectedId(id);
    setIsMobileDetailOpen(true);
  }

  // charge la page suivante d'offres avec filtres actifs
  function loadMore() {
    const nextPage = page + 1;
    setIsLoadingList(true);
    fetchJobOffers({
      page: nextPage,
      q: debouncedQuery,
      lieu: debouncedLieu,
      salaryMin: debouncedSalaryMin,
      salaryMax: debouncedSalaryMax,
      tags: debouncedKeywords,
    })
      .then((data) => {
        setJobs((prev) => [...prev, ...data.job_offers]);
        setIsEnd(data.is_the_end);
        setPage(nextPage);
      })
      .catch((err) => setListError(err.message))
      .finally(() => setIsLoadingList(false));
  }

  return {
    // recherche
    query,
    setQuery,
    lieu,
    setLieu,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    selectedTags,
    toggleTag,
    keywords,
    addKeyword,
    removeKeyword,
    availableTags,
    availableKeywordTags,

    // liste
    isLoadingList,
    listError,
    isEnd,
    loadMore,
    visibleJobs,

    // sélection / détail
    selectedId,
    selectedDetail,
    isLoadingDetail,
    detailError,
    handleSelectJob,

    // onglets feed / saved
    mode,
    setMode,
    isLoadingSaved,
    savedError,

    // sauvegardes
    saved,
    toggleSave,

    // modal mobile
    isMobileDetailOpen,
    setIsMobileDetailOpen,
  };
}