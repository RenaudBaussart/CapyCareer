# Routes backend

Ce document liste les routes exposées par le backend et explique brièvement leur rôle.

## Route de santé

### `GET /api/health`
**Fichier** : `server/src/app.ts`

#### Rôle
Vérifier que l’API fonctionne correctement.

#### Réponse
- `200` : `{"status":"ok","message":"API Job Aggregator fonctionnelle"}`

## Documentation Swagger

### `GET /api-docs`
**Fichier** : `server/src/app.ts`

#### Rôle
Afficher la documentation interactive de l’API générée avec Swagger UI.

#### Contenu
Cette route ouvre l’interface Swagger qui liste toutes les routes documentées dans `server/src/swagger.ts`, avec :
- les descriptions
- les paramètres attendus
- les schémas de requêtes et réponses
- les exemples OpenAPI

#### Utilité
Elle permet de tester et consulter l’API sans passer par un client externe.

## Routes d’authentification

Ces routes sont montées sous le préfixe `/api/auth`.

### `POST /api/auth/register`
**Rôle** : créer un nouveau compte membre.

**Validation** : schéma `member`.

**Réponses principales** :
- `201` : membre créé + token
- `400` : erreur de validation
- `409` : email déjà utilisé
- `500` : erreur serveur

### `POST /api/auth/login`
**Rôle** : authentifier un membre existant.

**Validation** : schéma `loginSchema`.

**Réponses principales** :
- `200` : connexion réussie + token
- `400` : erreur de validation
- `401` : identifiants invalides
- `500` : erreur serveur

### `POST /api/auth/logout`
**Rôle** : déconnecter un membre connecté.

**Sécurité** : route protégée par `middlewareAuth`.

**Réponses principales** :
- `200` : déconnexion réussie
- `401` : token manquant ou invalide
- `500` : erreur serveur

## Résumé rapide

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | Vérifier l’état de l’API |
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/logout` | Déconnexion |

## Architecture associée

- `auth.route.ts` : définition des routes
- `auth.controller.ts` : gestion des requêtes/réponses
- `auth.service.ts` : logique métier et accès base de données
- `authMiddleware.ts` : protection des routes
- `authUtility.ts` : génération JWT
