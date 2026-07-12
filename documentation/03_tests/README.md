# Tests backend

Cette section explique comment les tests du backend sont organisés et ce qu’ils vérifient.

## Structure

Les tests sont principalement situés dans `server/src/` et couvrent trois niveaux :
- les utilitaires
- les services
- les contrôleurs

## Fichiers de test présents

- `server/src/core/utils/authUtility.test.ts`
- `server/src/modules/auth/auth.service.test.ts`
- `server/src/modules/auth/auth.controller.spec.ts`

## Philosophie des tests

Les tests du projet utilisent une approche de type :
- **unitaire** pour les utilitaires et la logique métier
- **intégration légère** pour les contrôleurs avec `supertest`
- **mocking** pour éviter de dépendre d’une vraie base MySQL ou d’un vrai JWT

## Outils utilisés

- `jest` pour l’exécution des tests
- `ts-jest` pour tester du TypeScript directement
- `supertest` pour simuler des requêtes HTTP
- `jest-html-reporter` pour générer un rapport HTML

## Variables d’environnement de test

Le fichier `server/tests/setup.ts` charge un environnement de test et définit :
- `JWT_SECRET`
- `NODE_ENV=test`

Cela permet d’exécuter les tests dans un contexte stable et reproductible.
