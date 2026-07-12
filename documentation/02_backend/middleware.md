# Backend - Middleware

## `middlewareAuth`

Le middleware d’authentification se trouve dans `server/src/core/middlewares/authMiddleware.ts`.

### Rôle
Protéger les routes qui nécessitent un utilisateur connecté.

### Fonctionnement
1. Il lit le token dans l’en-tête `Authorization`.
2. Il attend un format de type `Bearer <token>`.
3. Si aucun token n’est fourni, il renvoie `401`.
4. Si le token est invalide, il renvoie `401`.
5. Si le token est valide, il ajoute les données décodées à `req.member`.
6. Il appelle `next()` pour laisser continuer la requête.

### Utilisation actuelle
Le middleware est utilisé sur :
- `POST /api/auth/logout`

### Pourquoi il est important
Sans ce middleware, n’importe quelle requête pourrait appeler certaines routes protégées.
Il sert donc de barrière de sécurité avant l’exécution de la logique métier.

### Données ajoutées à la requête
Le middleware étend l’interface `Express.Request` pour ajouter :
- `member`

Cela permet de stocker le payload JWT décodé pour le réutiliser plus tard dans la requête.

### Exemple logique
- Requête avec `Authorization: Bearer <token>`
- Vérification JWT
- Ajout du contenu décodé dans `req.member`
- Passage au contrôleur

## Résumé
Le middleware joue le rôle de filtre d’accès :
- autorise l’accès si le token est valide
- bloque la route sinon
