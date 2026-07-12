# Tests - `auth.controller`

Ce fichier décrit les tests du contrôleur d’authentification situé dans `server/src/modules/auth/auth.controller.spec.ts`.

## Objectif

Vérifier les réponses HTTP renvoyées par les routes d’authentification.

## Méthode

Les tests utilisent :
- `express`
- `supertest`
- des mocks de `AuthService`
- des mocks de `jsonwebtoken`

## Routes testées

### `POST /api/auth/register`
Cas couverts :
- succès avec statut `201`
- erreur `409` si l’email existe déjà
- erreur `400` si la validation Zod échoue
- erreur `500` en cas d’erreur serveur

### `POST /api/auth/login`
Cas couverts :
- succès avec statut `200`
- erreur `401` si les identifiants sont incorrects
- erreur `400` si la validation Zod échoue
- erreur `500` en cas d’erreur serveur

### `POST /api/auth/logout`
Cas couverts :
- succès avec statut `200`
- erreur `401` si le token est absent
- erreur `500` si le service échoue

## Ce que ces tests vérifient

Ils s’assurent que :
- le bon code HTTP est renvoyé
- le corps JSON contient les bons messages
- le contrôleur appelle le service avec les bons paramètres
- la validation des données fonctionne avant l’appel au service

## Pourquoi c’est important

Le contrôleur est la première couche visible par le client. Ces tests garantissent donc que l’API répond correctement même si la logique métier est mockée.
