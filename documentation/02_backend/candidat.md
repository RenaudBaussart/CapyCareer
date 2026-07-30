# Backend - Module Candidat

Ce document décrit le fonctionnement des routes spécifiques aux utilisateurs ayant le statut de candidat.

## Vue d’ensemble

Ce module gère les interactions exclusives aux candidats, telles que l'accès et la postulation aux offres d'emploi. Les routes sont généralement montées sous le préfixe `/api/candidates`.

Le routeur est défini dans `server/src/modules/candidates/candidat.route.ts` et s'appuie sur :
- `candidat.controller.ts` pour la gestion des requêtes et la redirection.
- `candidat.service.ts` pour la logique métier (vérifications en base de données).
- `candidat.schema.ts` pour la validation stricte des paramètres.
- `middlewareAuth` pour s'assurer que seul un utilisateur connecté peut interagir avec ces routes.

---

## Route `GET /redirect/:jobId`

### Rôle
Vérifier l'éligibilité d'un candidat pour une offre spécifique, puis le rediriger vers le lien externe de l'offre d'emploi.

### Sécurité
- **Authentification** : Route protégée par le `middlewareAuth` (l'utilisateur doit être connecté et non banni/blacklisté).
- **Contrôle de Rôle (RBAC)** : Le service vérifie strictement en base de données que l'utilisateur connecté possède bien le rôle `candidat`.

### Fichiers concernés
- `candidat.controller.ts` (`redirectToSite`)
- `candidat.service.ts` (`redirectToSite` et ses méthodes privées)
- `candidat.schema.ts` (`applySchema`)

### Données attendues
1. **Paramètre d'URL (`req.params`)** :
   - `jobId` : L'identifiant de l'offre d'emploi (converti en nombre entier).
2. **Contexte d'authentification (`req.member`)** :
   - L'identifiant de l'utilisateur connecté (`req.member.id`), extrait automatiquement par le middleware.

La validation Zod (`applySchema`) s'assure que le `jobId` est bien un entier positif. *(Note : le schéma autorise aussi une `coverLetter` optionnelle, prévue pour de futures routes de postulation interne).*

### Traitement
1. Validation Zod du `jobId` extrait de l'URL.
2. Récupération de l'ID de l'utilisateur connecté via le middleware.
3. Le service exécute séquentiellement plusieurs vérifications critiques en base de données :
   - Vérifie si l'**offre d'emploi existe**.
   - Vérifie si le **candidat existe** toujours.
   - Vérifie dans la table `Applied` si le candidat **a déjà postulé** à cette offre (blocage des doublons).
   - Vérifie que l'utilisateur a bien le **rôle "candidat"** (un administrateur ou une entreprise ne peut pas postuler).
4. Si toutes les vérifications passent, le service récupère la colonne `url` de l'offre.
5. Le contrôleur déclenche une **redirection HTTP** (`res.redirect`) vers ce lien externe.

### Réponses
- `302 Found` : Succès, redirection HTTP automatique vers le site externe de l'offre.
- `400 Bad Request` : L'ID de l'offre fourni dans l'URL est invalide (ex: texte au lieu d'un nombre).
- `401 / 403` : Token manquant/invalide, ou l'utilisateur n'a pas le rôle "candidat" (`USER_NOT_CANDIDATE`).
- `404 Not Found` : L'offre d'emploi ciblée ou le compte candidat n'existe pas.
- `409 Conflict` : Le candidat a déjà postulé à cette offre (`ALREADY_APPLIED`).
- `500 Internal Server Error` : Erreur interne liée à la base de données.

---

## Flux Global

1. Le **client** clique sur une offre, ce qui appelle `GET /api/candidates/redirect/123`.
2. Le **middleware d'authentification** vérifie le JWT, valide la session et peuple `req.member`.
3. Le **contrôleur** intercepte la requête, parse l'ID de l'offre en entier et le fait valider par **Zod**.
4. Le **service** s'assure que le contexte métier est valide (pas de doublon de candidature, bon rôle, données existantes).
5. La base de données renvoie l'URL externe.
6. Le **contrôleur** clôture la boucle en renvoyant une réponse de redirection au navigateur.