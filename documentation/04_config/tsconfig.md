# Configuration TypeScript

La configuration TypeScript du backend se trouve dans `server/tsconfig.json`.

## Rôle

Ce fichier définit comment TypeScript doit analyser et compiler le projet backend.

## Points importants

### `module: "esnext"`
Le projet utilise le système de modules moderne.

### `moduleResolution: "bundler"`
Adapté à un projet Node moderne avec outillage TypeScript / build léger.

### `target: "esnext"`
Le code cible une version moderne de JavaScript.

### `types: ["node", "jest"]`
TypeScript connaît :
- les types Node.js
- les types Jest

C’est essentiel pour les fichiers de test.

### `strict: true`
Active un typage strict pour détecter plus d’erreurs à la compilation.

### `esModuleInterop: true`
Facilite l’import de modules CommonJS comme `bcrypt`, `jsonwebtoken` ou `express`.

### `noUncheckedIndexedAccess: true`
Force un contrôle plus strict sur l’accès aux tableaux et objets indexés.

### `exactOptionalPropertyTypes: true`
Renforce la précision sur les propriétés optionnelles.

## Pourquoi ces choix

Cette configuration permet :
- un typage solide
- une meilleure sécurité de code
- une bonne compatibilité avec Jest
- une compatibilité avec les bibliothèques Node du projet
