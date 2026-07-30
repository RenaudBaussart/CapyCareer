# Backend - Authentification

Ce document décrit le fonctionnement des routes d’authentification du backend.

## Vue d’ensemble

Les routes d’authentification sont montées dans `server/src/app.ts` sous le préfixe `/api/auth`.

Le router est défini dans `server/src/modules/auth/auth.route.ts` et s’appuie sur :
- `auth.controller.ts` pour gérer les requêtes HTTP
- `auth.service.ts` pour la logique métier
- `member.schema.ts` et `auth.schema.ts` pour valider les données entrantes
- `authMiddleware.ts` pour protéger la déconnexion
- **Middlewares de sécurité additionnels** : Un Rate Limiter pour prévenir les attaques par force brute, et un middleware vérifiant la présence d'un token pour empêcher les utilisateurs déjà connectés d'accéder aux routes d'inscription et de connexion.

## Route `POST /api/auth/register`

### Rôle
Créer un nouveau membre et générer un token JWT dès l’inscription.

### Sécurité
- Bloquée si l'utilisateur possède déjà un token valide (impossible de s'inscrire en étant déjà connecté).

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
2. Vérification dans la table `Banned` pour s'assurer que l'email n'est pas banni.
3. Vérification si l’email ou le nom d'utilisateur existe déjà en base.
4. Hash du mot de passe avec `bcrypt`.
5. Insertion dans la table `User_`.
6. Génération d’un token JWT via `generatememberToken()`.

### Réponses
- `201` : membre créé avec succès + token
- `400` : erreur de validation Zod ou champs non conformes (ex: utilisateur banni)
- `403` : utilisateur déjà connecté
- `409` : email ou nom d'utilisateur déjà utilisé
- `500` : erreur serveur

### Remarque métier
La validation du schéma `member` utilise aussi `leo-profanity` pour refuser certains mots dans `firstname`, `lastname`, `username` et `biography`.

## Route `POST /api/auth/login`

### Rôle
Authentifier un membre existant et renvoyer un token JWT.

### Sécurité
- **Rate Limiting** : Limite le nombre de tentatives de connexion pour éviter le brute-force.
- **Vérification de session** : Bloquée si l'utilisateur possède déjà un token valide.

### Fichier concerné
- `server/src/modules/auth/auth.controller.ts`
- `server/src/modules/auth/auth.service.ts`
- `server/src/modules/auth/auth.schema.ts`

### Données attendues
Le corps est validé par `loginSchema` :
- `username`
- `password`
- `stayConnected` : booléen (détermine si le token généré aura une expiration courte ou longue)

### Traitement
1. Validation des champs.
2. Vérification dans la table `Banned` pour s'assurer que le nom d'utilisateur n'est pas banni.
3. Recherche du membre par `username`.
4. Comparaison du mot de passe avec le hash stocké.
5. Génération du token JWT en appliquant la durée d'expiration correspondante au choix `stayConnected`.

### Réponses
- `200` : connexion réussie + token
- `400` : erreur de validation ou compte banni
- `401` : identifiants incorrects
- `403` : utilisateur déjà connecté
- `429` : trop de tentatives de connexion (Rate Limit)
- `500` : erreur serveur

## Route `POST /api/auth/logout`

### Rôle
Déconnecter un membre authentifié en invalidant définitivement son token.

### Sécurité
- Cette route est protégée par `middlewareAuth`.

### Traitement
1. Le token est lu dans l’en-tête `Authorization`.
2. Le middleware vérifie sa validité.
3. Le contrôleur appelle `authService.logout()`.
4. La date de dernière connexion est mise à jour en base.
5. Le token est inséré dans la table `Blacklist` avec la date actuelle pour l'invalider côté serveur.

### Réponses
- `200` : déconnexion réussie
- `401` : token absent ou invalide
- `500` : erreur serveur (ex: échec d'insertion dans la Blacklist)

## Flux global

- Les middlewares interceptent la requête (vérification si déjà connecté, rate limiting).
- Le contrôleur reçoit la requête HTTP.
- Le schéma Zod valide les données.
- Le service exécute les opérations en base de données (vérifications, insertions, blacklist).
- L’utilitaire JWT génère le token (avec gestion adaptative de l'expiration).
- Le middleware d'authentification protège les routes sensibles et vérifie que les tokens ne sont pas blacklistés.

## Améliorations possibles
- Mise en place d'un système de Refresh Tokens pour éviter de stocker des tokens à très longue durée de vie côté client.
- Nettoyage automatique de la table `Blacklist` (par exemple via une tâche Cron) pour supprimer les tokens dont la date d'expiration d'origine est dépassée, afin de ne pas surcharger la base de données.