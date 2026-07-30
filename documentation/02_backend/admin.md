# Backend - Module Admin

Ce document décrit le fonctionnement des routes d'administration, réservées exclusivement aux utilisateurs possédant les privilèges les plus élevés (rôle `admin`).

## Vue d’ensemble

Ce module permet la gestion globale des utilisateurs de la plateforme : consultation, modification, bannissement et débannissement. Les routes sont montées sous le préfixe `/api/admin` (ou similaire).

Le routeur est défini dans `server/src/modules/admin/admin.route.ts` et s'appuie sur :
- `admin.controller.ts` pour la gestion des requêtes HTTP.
- `admin.service.ts` pour la logique métier et les requêtes SQL (fortement transactionnelles).
- `updateMemberSchema` (venant de `member.schema.ts`) pour la validation des données de mise à jour.
- `middlewareAuthAdmin` pour garantir que seul un administrateur connecté peut accéder à ces ressources.

---

## Route `GET /members`

### Rôle
Récupérer la liste des utilisateurs de la plateforme. Permet de récupérer tous les membres ou de filtrer par rôle. L'administrateur qui fait la requête est automatiquement exclu de la liste renvoyée.

### Paramètres attendus
- **Query `?role=`** (optionnel) : Permet de filtrer par rôle (`candidat`, `entreprise`, `admin`).

### Traitement
1. Le contrôleur vérifie la présence du paramètre `role`.
2. Si un rôle est fourni, le service valide ce rôle via un dictionnaire strict (`ROLE_MAP`) et filtre la requête SQL.
3. Si aucun rôle n'est fourni, le service récupère tous les utilisateurs.
4. Dans les deux cas, le profil de l'administrateur effectuant la requête (`req.member.id`) est filtré des résultats pour ne pas s'afficher lui-même.

### Réponses
- `200` : Liste récupérée avec succès.
- `400` : Rôle fourni invalide.
- `401 / 403` : Accès refusé (non-admin ou non connecté).
- `404` : Aucun membre trouvé.

---

## Routes de Bannissement

### `DELETE /members/ban`
- **Rôle** : Bannir un utilisateur et supprimer définitivement son compte.
- **Paramètre** : `?email=...` (adresse e-mail de l'utilisateur à bannir).
- **Sécurité métier** : Il est **impossible de bannir un autre administrateur**.
- **Traitement (Transactionnel)** :
  1. Vérifie que l'utilisateur existe et n'est pas admin.
  2. Insère l'e-mail et le pseudo dans la table `Banned`.
  3. Supprime l'utilisateur de la table `User_`.
  4. Valide la transaction (`commit`).
- **Réponses** : `200` (Succès), `400` (E-mail manquant ou tentative de bannir un admin), `404` (Membre introuvable).

### `DELETE /members/unban`
- **Rôle** : Retirer une adresse e-mail de la liste noire, permettant à la personne de recréer un compte.
- **Paramètre** : `?email=...`
- **Traitement (Transactionnel)** : Cherche l'e-mail dans la table `Banned` et le supprime si trouvé.
- **Réponses** : `200` (Succès), `400` (E-mail manquant), `404` (E-mail non trouvé dans les bannis).

---

## Routes de Mise à Jour (Update)

Le contrôleur utilise une méthode centralisée (`updateMembers`) pour traiter différentes actions de modification sur le profil d'un autre utilisateur. L'ID de l'utilisateur cible est passé dans l'URL (`/members/:id...`).

### 1. `PUT /members/:id` (Profil général)
- **Rôle** : Modifier les informations générales d'un utilisateur (prénom, nom, email, etc.).

### 2. `PATCH /members/:id/role` (Rôle)
- **Rôle** : Changer les privilèges d'un utilisateur (ex: passer un candidat en entreprise).

### 3. `PATCH /members/:id/password` (Mot de passe)
- **Rôle** : Forcer la réinitialisation/changement du mot de passe d'un utilisateur. Le service s'occupera du hachage avec `bcrypt`.

### Traitement Commun (Transactionnel)
1. Le contrôleur détermine quelle donnée valider avec Zod (`updateMemberSchema`) selon l'URL appelée.
2. Le service `performAdminUpdate` démarre une transaction SQL.
3. **Sécurité métier** : Le service s'assure que l'utilisateur cible existe et **qu'il n'est pas un administrateur** (un admin ne peut pas modifier un autre admin via cette route).
4. Si l'e-mail est modifié, vérification stricte des conflits (table `User_` et table `Banned`).
5. Mise à jour dynamique des champs fournis (mot de passe, rôle, et/ou profil).
6. Validation de la transaction.

### Réponses
- `200` : Profil, rôle ou mot de passe mis à jour avec succès.
- `400` : Erreur de validation Zod, rôle invalide, ou tentative de modifier un administrateur.
- `401 / 403` : Accès refusé (non-admin).
- `404` : Utilisateur cible introuvable.
- `409` : Conflit (Le nouvel e-mail est déjà utilisé ou banni).
- `500` : Erreur serveur.

---

## Flux Global & Sécurité

1. **Barrière d'entrée** : Le `middlewareAuthAdmin` vérifie le JWT, s'assure qu'il n'est pas blacklisté, et valide strictement que `req.member.role === 'admin'`. Toute autre requête est immédiatement rejetée en `403`.
2. **Protection intra-rôle** : La couche Service (`admin.service.ts`) intègre des vérifications pour empêcher la modification ou la suppression de comptes possédant le rôle `admin`. Cela protège le système contre les abus ou erreurs fatales (ex: un admin qui supprimerait le seul autre compte admin).
3. **Transactions SQL Systématiques** : Pour les modifications complexes (Bannissement, mises à jour multiples), l'utilisation des méthodes `beginTransaction()`, `commit()` et `rollback()` garantit que la base de données reste dans un état cohérent, même en cas de crash en cours de route.