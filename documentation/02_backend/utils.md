# Backend - Utils

## `generatememberToken`

L’utilitaire principal d’authentification est défini dans `server/src/core/utils/authUtility.ts`.

### Rôle
Générer un token JWT à partir des données d’un membre.

### Entrée
L’utilitaire reçoit un objet `TokenMember` contenant :
- `id`
- `role`
- `isFirstLogin`

### Sortie
Une chaîne de caractères JWT.

### Fonctionnement
1. Il construit un payload avec les données du membre.
2. Il vérifie que `JWT_SECRET` existe dans les variables d’environnement.
3. Il signe le token avec `jsonwebtoken`.
4. Il applique une expiration via `JWT_EXPIRATION`.

### Variables d’environnement utilisées
- `JWT_SECRET` : clé de signature du token
- `JWT_EXPIRATION` : durée de validité du token

### Pourquoi cet utilitaire est utile
Il centralise la génération des tokens pour éviter de dupliquer la logique dans les services.

### Utilisation dans le code
Il est appelé dans `AuthService` après :
- une inscription réussie
- une connexion réussie

## Interface `TokenMember`

Cette interface décrit le contenu minimal attendu dans le token :
- identifiant du membre
- rôle
- indication de premier login

## Idée générale
Les utils servent à factoriser le code technique réutilisable.
Dans ce projet, cet utilitaire encapsule toute la logique JWT liée aux membres.
