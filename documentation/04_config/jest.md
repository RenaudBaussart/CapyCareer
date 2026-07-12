# Configuration Jest

La configuration Jest du backend se trouve dans `server/jest.config.js`.

## Rôle

Jest sert à exécuter les tests TypeScript du backend.

## Configuration principale

### `preset: "ts-jest"`
Permet à Jest de comprendre directement les fichiers TypeScript sans compilation manuelle préalable.

### `testEnvironment: "node"`
Indique que les tests s’exécutent dans un environnement Node.js.

### `setupFilesAfterEnv`
Charge `server/tests/setup.ts` avant les tests.

Ce fichier permet notamment de :
- charger `.env.test`
- définir `JWT_SECRET`
- définir `NODE_ENV=test`

### `reporters`
Le projet utilise aussi `jest-html-reporter` pour générer un rapport HTML des tests.

## Script npm associé

Dans `server/package.json` :

- `npm run test`

Ce script lance :
- `jest`
- `--detectOpenHandles`
- `--forceExit`
- `--coverage`

## Pourquoi cette configuration est utile

Elle permet :
- d’exécuter des tests TypeScript simplement
- de simuler un environnement serveur
- d’avoir un rapport de couverture
- de détecter les ressources mal fermées
