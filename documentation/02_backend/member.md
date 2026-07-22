# Backend - Module Membre

Ce document décrit le fonctionnement des routes liées à la gestion du profil des membres connectés.

## Vue d’ensemble

Les routes des membres sont dédiées aux actions que l'utilisateur authentifié peut effectuer sur son propre compte. 
Elles sont généralement montées sous le préfixe `/api/members` (ou similaire).

Le routeur est défini dans le module `member` et s'appuie sur :
- `member.controller.ts` pour gérer les requêtes HTTP.
- `member.service.ts` pour la logique métier et les transactions avec la base de données.
- `member.schema.ts` pour valider les données de mise à jour via Zod.
- `middlewareAuth` pour s'assurer que seul l'utilisateur connecté accède à ses propres données.

Toutes les routes de ce module **nécessitent une authentification valide**.

---

## Route `GET /me`

### Rôle
Récupérer les informations du profil du membre actuellement connecté.

### Fichier concerné
- `member.controller.ts` (`getMyProfile`)
- `member.service.ts` (`getMemberById`)

### Traitement
1. Le middleware d'authentification injecte les données du JWT dans `req.member`.
2. Le contrôleur extrait `req.member.id`.
3. Le service interroge la table `User_` pour récupérer toutes les colonnes publiques de l'utilisateur (email, rôle, prénom, nom, pseudo, biographie, photo, dates).
4. Renvoie les données structurées.

### Réponses
- `200` : Profil récupéré avec succès + objet `member`.
- `401` : Non autorisé (token manquant ou invalide).
- `404` : Membre introuvable.
- `500` : Erreur serveur.

---

## Routes de Mise à Jour (Update)

L'architecture centralise la mise à jour sur un seul contrôleur (`updateMyProfile`) qui distribue la logique en fonction de l'URL appelée. Cela permet de séparer les responsabilités métier (mot de passe vs profil général vs identifiants).

### 1. `PUT /me` (Profil général)
- **Rôle** : Mettre à jour les informations générales (prénom, nom, biographie, photo de profil).
- **Validation** : `updateProfileSchema`
- **Message de succès** : *"Profil mis à jour avec succès."*

### 2. `PATCH /me/password` (Mot de passe)
- **Rôle** : Mettre à jour le mot de passe de l'utilisateur.
- **Validation** : `updatePasswordSchema`
- **Traitement spécifique** : Le service intercepte la clé `password` ou `newPassword`, hache la nouvelle valeur avec `bcrypt`, et la met à jour en base de données.
- **Message de succès** : *"Mot de passe mis à jour avec succès."*

### 3. `PATCH /me/account` (Compte / Identifiants)
- **Rôle** : Mettre à jour l'email et/ou le nom d'utilisateur (username).
- **Validation** : `updateAccountSchema`
- **Traitement spécifique** : Le service effectue des vérifications de sécurité cruciales :
  - Vérifie dans la table `Banned` que le nouvel email ou pseudo n'est pas banni.
  - Vérifie dans la table `User_` que le nouvel email ou pseudo n'est pas déjà utilisé par un autre membre.
- **Message de succès** : *"Informations de compte mises à jour avec succès."*

### Réponses Communes aux Mises à Jour
- `200` : Mise à jour réussie.
- `400` : Erreur de validation Zod des données envoyées.
- `401` : Non autorisé.
- `404` : Membre introuvable.
- `409` : Conflit (Email/Pseudo déjà pris ou banni).
- `500` : Erreur serveur.

---

## Route `DELETE /me`

### Rôle
Supprimer définitivement le compte du membre connecté et invalider sa session active.

### Fichier concerné
- `member.controller.ts` (`deleteMyProfile`)
- `member.service.ts` (`deleteYourProfile`)

### Traitement (Transactionnel)
Cette route utilise une **Transaction SQL** (`beginTransaction` / `commit` / `rollback`) pour garantir l'intégrité des données :
1. Le contrôleur extrait `req.member.id` et le `token` JWT actuel depuis l'en-tête.
2. Le service débute la transaction.
3. Il supprime l'enregistrement de l'utilisateur dans la table `User_`.
4. Il insère immédiatement le `token` dans la table `Blacklist` pour empêcher toute réutilisation post-suppression (déconnexion forcée).
5. Si tout réussit, la transaction est validée (`commit`). En cas d'erreur, tout est annulé (`rollback`).

### Réponses
- `200` : Profil supprimé et déconnexion réussie.
- `401` : Token non fourni ou invalide.
- `404` : Membre introuvable (déjà supprimé).
- `500` : Erreur serveur.

---
