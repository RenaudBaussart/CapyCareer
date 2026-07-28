// fichier gerant appels API vers back pour offres d'emploi

const API_URL = import.meta.env.VITE_API_URL;

// recup une page doffre
export async function fetchJobOffers({ page = 0, search = "" } = {}) {
  let url = `${API_URL}/jobs?page=${page + 1}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les offres d'emploi.");
  }

  return response.json();
}

// recup detail offre
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
