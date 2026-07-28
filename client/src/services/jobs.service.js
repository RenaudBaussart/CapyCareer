// fichier gérant les appels API vers le back pour les offres d'emploi

const API_URL = import.meta.env.VITE_API_URL;

// récupère une page d'offres (le back est en pagination 1-based, le front travaille en 0-based)
export async function fetchJobOffers({
  page = 0,
  q,
  lieu,
  salaryMin,
  salaryMax,
} = {}) {
  const params = new URLSearchParams({ page: page + 1 });

  if (q) params.set("q", q);
  if (lieu) params.set("lieu", lieu);
  if (salaryMin) params.set("salaryMin", salaryMin);
  if (salaryMax) params.set("salaryMax", salaryMax);

  const response = await fetch(`${API_URL}/jobs?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les offres d'emploi.");
  }

  return response.json(); // { job_offers: [...], is_the_end: boolean }
}

// récupère le détail d'une offre
export async function fetchJobOfferDetail(id) {
  const response = await fetch(`${API_URL}/jobs/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Offre introuvable");
    }
    throw new Error("Impossible de récupérer le détail de l'offre.");
  }

  return response.json();
}
