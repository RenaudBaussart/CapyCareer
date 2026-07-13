# Backend - Authentification

Ce document décrit le fonctionnement des routes d’authentification du backend.

## Vue d’ensemble

Les routes d’authentification sont montées dans `server/src/app.ts` sous le préfixe `/api/auth`.

Le router est défini dans `server/src/modules/auth/auth.route.ts` et s’appuie sur :
- `auth.controller.ts` pour gérer les requêtes HTTP
- `auth.service.ts` pour la logique métier
- `member.schema.ts` et `auth.schema.ts` pour valider les données entrantes
- `authMiddleware.ts` pour protéger la déconnexion

## Route `POST /api/auth/register`

### Rôle
Créer un nouveau membre et générer un token JWT dès l’inscription.

### Fichier concerné
- `server/src/modules/auth/auth.controller.ts`
- `server/src/modules/auth/auth.service.ts`
- `server/src/modules/members/member.schema.ts`

### Données attendues
Le corps de la requête est validé par `member.parse(req.body)`.

Champs principaux :
- `email`
- `password`
- `role` : `candidat`, `entreprise` ou `admin`
- `firstname`
- `lastname`
- `username`
- `biography` optionnel
- `profil_pic_link` optionnel

### Traitement
1. Validation Zod du payload.
2. Vérification si l’email existe déjà en base.
3. Hash du mot de passe avec `bcrypt`.
4. Insertion dans la table `User_`.
5. Génération d’un token JWT via `generatememberToken()`.

### Réponses
- `201` : membre créé avec succès + token
- `400` : erreur de validation
- `409` : email déjà utilisé
- `500` : erreur serveur

### Remarque métier
La validation du schéma `member` utilise aussi `leo-profanity` pour refuser certains mots dans `firstname`, `lastname`, `username` et `biography`.

## Route `POST /api/auth/login`

### Rôle
Authentifier un membre existant et renvoyer un token JWT.

### Fichier concerné
- `server/src/modules/auth/auth.controller.ts`
- `server/src/modules/auth/auth.service.ts`
- `server/src/modules/auth/auth.schema.ts`

### Données attendues
Le corps est validé par `loginSchema` :
- `username`
- `password`

### Traitement
1. Validation des champs.
2. Recherche du membre par `username`.
3. Comparaison du mot de passe avec le hash stocké.
4. Génération du token JWT.

### Réponses
- `200` : connexion réussie + token
- `400` : erreur de validation
- `401` : identifiants incorrects
- `500` : erreur serveur

## Route `POST /api/auth/logout`

### Rôle
Déconnecter un membre authentifié.

### Sécurité
Cette route est protégée par `middlewareAuth`.

### Traitement
1. Le token est lu dans l’en-tête `Authorization`.
2. Le middleware vérifie sa validité.
3. Le contrôleur appelle `authService.logout()`.
4. La date de dernière connexion est mise à jour en base.

### Réponses
- `200` : déconnexion réussie
- `401` : token absent ou invalide
- `500` : erreur serveur

## Flux global

- Le contrôleur reçoit la requête HTTP.
- Le schéma Zod valide les données.
- Le service exécute les opérations base de données.
- L’utilitaire JWT génère le token.
- Le middleware protège les routes sensibles.

## Améliorations possibles
- Pouvoir rajouter une blacklist de tokens pour gérer la déconnexion côté serveur.

