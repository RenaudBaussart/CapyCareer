// wrapper autour de fetch qui détecte les réponses 401 (token invalide/expiré/blacklisté) pour déco l'user 

let onUnauthorized = null;

export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function authFetch(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  return response;
}
