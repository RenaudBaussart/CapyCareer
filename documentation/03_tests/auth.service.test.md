# Tests - `auth.service`

Ce fichier décrit les tests du service d’authentification situé dans `server/src/modules/auth/auth.service.test.ts`.

## Objectif

Vérifier la logique métier du service sans passer par de vraies dépendances externes.

## Méthode de test

Le service est testé avec des mocks pour :
- le pool MySQL
- `bcrypt`
- `jsonwebtoken`
- `generatememberToken`

Cela permet de tester uniquement la logique métier du service.

## Cas testés

### `register()`
#### Échec : email déjà existant
- la requête SQL retourne déjà un utilisateur
- le service doit lever l’erreur `EMAIL_EXISTS`
- le hash du mot de passe ne doit pas être appelé

#### Succès
- vérification de l’absence d’email en base
- hash du mot de passe avec `bcrypt.hash()`
- insertion en base
- génération du token avec le bon payload
- libération de la connexion DB

### `login()`
#### Échec : utilisateur introuvable
- aucune ligne SQL retournée
- le service doit lever `USER_NOT_FOUND`

#### Échec : mot de passe invalide
- utilisateur trouvé
- `bcrypt.compare()` retourne `false`
- le service doit lever `INVALID_PASSWORD`

#### Succès
- utilisateur trouvé
- mot de passe validé
- génération du token avec `isFirstLogin: false`

### `logout()`
#### Échec : erreur base de données
- la requête SQL échoue
- le service doit remonter l’erreur

#### Succès
- le token est décodé
- la date de dernière connexion est mise à jour
- le service retourne `{ message: "Déconnexion réussie." }`

## Ce que ces tests garantissent

Ils vérifient que le service :
- respecte les règles métier
- appelle les bons outils au bon moment
- gère les erreurs attendues
- libère bien la connexion MySQL
