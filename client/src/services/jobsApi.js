// fichier gérant les appels au backend pour les offres d'emploi

const BASE_URL = import.meta.env.VITE_API_URL;

// recupere page de la liste des offres (route listing)
export async function fetchJobOffers({ page = 0 } = {}) {
  const res = await fetch(`${BASE_URL}/job-offers?page=${page}`);
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des offres");
  }
  return res.json();
}

// recupere détail d'une offre précise (route offre)
export async function fetchJobOfferDetail(id) {
  const res = await fetch(`${BASE_URL}/job-offers/${id}`);
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération de l'offre");
  }
  return res.json();
}
