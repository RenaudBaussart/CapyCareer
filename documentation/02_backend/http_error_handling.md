# Documentation Développeur : Gestion des Erreurs et Logging

Ce document explique comment fonctionne le système centralisé de gestion des erreurs et de logging quotidien au sein de notre API Express + TypeScript.

---

## Architecture Globale

Le système repose sur trois piliers :

*   **Les classes d'erreurs (`src/errors/HttpError.ts`)** : Permettent de lever des exceptions typées embarquant un code statut HTTP.
*   **Le Logger Quotidien (`src/utils/customLogger.ts`)** : Un utilitaire fait maison utilisant le module natif `fs` de Node.js pour écrire les anomalies dans un fichier nommé d'après la date du jour (`logs/YYYY-MM-DD.log`).
*   **Le Middleware Global (`src/middlewares/errorHandler.ts`)** : L'entonnoir d'Express qui attrape toutes les erreurs, appelle le logger de fichier, et formate la réponse JSON finale pour le client.

---

## Comment utiliser les classes d'erreurs dans tes routes

Pour retourner une erreur propre au client, tu n'as plus besoin d'écrire des réponses HTTP manuelles au milieu de ta logique métier. Il te suffit de générer une exception avec la classe appropriée et de la passer à `next()`.

### 1. Importer les classes nécessaires
Faire l'import de `BadRequestError` ou `NotFoundError` depuis ton fichier `HttpError`.

### 2. Utilisation dans une route Synchrone
Dans une route classique, tu peux utiliser directement le mot-clé `throw`. Le bloc `catch` intercepte l'erreur et la transmet au middleware global via `next(error)`.

**Exemple :**

try {
  // validating user inputs
  if (itemCode.length < 3) {
    throw new BadRequestError("The item code must be at least 3 characters long");
  }
  res.json({ success: true });
} catch (error) {
  // forwarding the sync error
  next(error);
}

### 3. Utilisation dans une route Asynchrone (`async/await`)
**Règle d'or :** Dès que tu utilises `async`, le `try/catch` est obligatoire. Si une condition échoue ou qu'une promesse est rejetée, l'erreur doit être passée manuellement à `next(error)`.

**Exemple :**

try {
  // fetching data from database
  const user = await db.user.findById(req.params.id);
  if (!user) {
    throw new NotFoundError("User does not exist");
  }
  res.status(200).json(user);
} catch (error) {
  // mandatory next call for async handlers
  next(error);
}

---

## Structure des Fichiers de Logs Générés

Chaque jour, un nouveau fichier est créé automatiquement à la racine du projet dans le dossier `/logs`.

*   **Format du nom** : `YYYY-MM-DD.log`
*   **Format du contenu** : Un horodatage suivi du type d'erreur, de la route appelée et de la stack trace complète si le serveur a crashé.

---

## Bonnes Pratiques pour l'Équipe

*   **Pas de `console.log` sauvage** : Si tu veux inspecter une erreur critique, laisse faire le middleware d'erreur ou utilise une fonction dédiée.
*   **Toujours typer tes fonctions de routes** : Assure-toi d'inclure `next` de type `NextFunction` dans la signature de tes fonctions Express.
*   **Ne pas modifier le dossier `logs/` manuellement** : Il est ignoré par Git via le fichier `.gitignore`.