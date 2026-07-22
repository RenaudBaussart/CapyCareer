# Backend - Middlewares

Ce document décrit le fonctionnement des différents middlewares utilisés dans le backend pour sécuriser les routes et gérer les accès.

---

## `middlewareAuth`

Le middleware d’authentification général se trouve dans `server/src/core/middlewares/authMiddleware.ts`.

### Rôle
Protéger les routes qui nécessitent qu'un utilisateur soit connecté et valide.

### Fonctionnement
1. Il lit le token dans l’en-tête `Authorization` (format `Bearer <token>`).
2. Si aucun token n’est fourni, il renvoie une erreur `401`.
3. Il vérifie la validité du token JWT et décode son contenu.
4. **Vérification de la Blacklist** : Il interroge la base de données pour vérifier si le token a été révoqué (déconnexion). Si oui, il renvoie `401`.
5. **Vérification de Bannissement** : Il vérifie dans la table `Banned` si l'email de l'utilisateur a été banni. Si oui, il renvoie `401`.
6. Si tout est valide, il ajoute les données décodées à `req.member` et appelle `next()`.

### Pourquoi il est important
Sans ce middleware, n’importe quelle requête pourrait appeler certaines routes protégées. Il sert de barrière de sécurité principale avant l’exécution de la logique métier, s'assurant que l'utilisateur est bien connecté, qu'il ne s'est pas déconnecté entre-temps, et qu'il n'est pas banni.

---

## `middlewareAuthAdmin`

Ce middleware est utilisé pour protéger les routes strictement réservées aux administrateurs.

### Rôle
Vérifier que l'utilisateur connecté est valide, que son token n'est pas révoqué, et qu'il possède le rôle `admin`.

### Fonctionnement
1. Il lit le token dans l’en-tête `Authorization`. S'il est absent, il renvoie `401`.
2. **Vérification de la Blacklist** : Il vérifie si le token a été révoqué. Si c'est le cas, il renvoie `401`.
3. Il vérifie la signature JWT. Si le token est corrompu ou expiré, il renvoie `401`.
4. Il lit les données décodées et vérifie le rôle. Si le rôle n'est pas `admin`, il bloque l'accès et renvoie `403`.
5. Si l'utilisateur est bien un administrateur, il peuple `req.member` et appelle `next()`.

### Utilisation actuelle
Le middleware est utilisé sur les routes d'administration :
- `GET /members`
- `DELETE /members/ban`
- `DELETE /members/unban`
- `PATCH /members/:id/role`
- `PATCH /members/:id/password`
- `PUT /members/:id`

### Pourquoi il est important
Ce middleware garantit que seuls les administrateurs peuvent effectuer des actions critiques sur les données de l'application et la gestion des autres utilisateurs.

---

## `middlewareGuest`

Ce middleware est utilisé pour protéger les routes réservées aux utilisateurs **non connectés** (les invités).

### Rôle
Empêcher un utilisateur déjà connecté d'accéder à des pages illogiques pour lui (comme la page de connexion ou d'inscription).

### Fonctionnement
1. Il vérifie la présence d'un token dans l'en-tête `Authorization`.
2. S'il n'y a **pas de token**, l'utilisateur est un invité : il appelle `next()`.
3. S'il y a un token, il vérifie s'il est valide et s'il est dans la **Blacklist**.
4. Si le token est valide MAIS qu'il est blacklisté (l'utilisateur s'est déconnecté), il est traité comme un invité : il appelle `next()`.
5. Si le token est valide et actif, cela signifie que l'utilisateur est connecté : il renvoie une erreur `403 Forbidden` avec le message *"Vous êtes déjà connecté."*.

### Utilisation actuelle
Le middleware est utilisé sur :
- `POST /register`
- `POST /login`

---

## `loginLimiter` (Rate Limiting)

Ce middleware ajoute une couche de protection contre les attaques par force brute.

### Rôle
Limiter le nombre de requêtes qu'une même adresse IP peut envoyer sur les routes sensibles (comme la connexion).

### Fonctionnement
- **Fenêtre de temps** : 1 minute (`1 * 60 * 1000` ms).
- **Limite maximale** : 3 tentatives autorisées par fenêtre de temps.
- Si la limite est dépassée, le serveur bloque la requête et renvoie une erreur HTTP `429 Too Many Requests` avec le message : *"Trop de tentatives de connexion échouées. Veuillez réessayer dans 1 minute."*

### Utilisation actuelle
Le middleware est appliqué avant l'authentification sur :
- `POST /login`