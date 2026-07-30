// hook gérant les offres sauvegardées

import { useCallback, useEffect, useState } from "react";

const SAVED_JOBS_KEY = "capycareer_saved_jobs";

export function useSavedJobs() {
  const [saved, setSaved] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOBS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (err) {
      console.error("Impossible de lire les offres sauvegardées :", err);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(Array.from(saved)));
    } catch (err) {
      console.error("Impossible de sauvegarder les offres :", err);
    }
  }, [saved]);

  const toggleSave = useCallback((id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // retire une offre sauvegardée si elle n'existe plus
  const removeSaved = useCallback((id) => {
    setSaved((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return { saved, toggleSave, removeSaved };
}
