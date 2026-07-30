# Dépendances utilisées

Ce document explique les principales dépendances installées dans le backend et leur rôle.

## Dépendances de production

### `express`
Framework HTTP utilisé pour créer l’API.

### `mysql2`
Permet de communiquer avec la base MySQL via un pool de connexions.

### `bcrypt`
Utilisé pour hacher et comparer les mots de passe.

### `jsonwebtoken`
Utilisé pour générer et vérifier les tokens JWT.

### `zod`
Utilisé pour valider les données reçues par l’API.

### `leo-profanity`
Utilisé dans les schémas pour filtrer les mots interdits.

### `@asteasolutions/zod-to-openapi`
Utilisé pour documenter les schémas Zod dans Swagger/OpenAPI.

### `swagger-ui-express`
Permet d’exposer la documentation Swagger dans le navigateur.

### `cors`
Autorise les requêtes cross-origin.

### `dotenv`
Charge les variables d’environnement depuis les fichiers `.env`.

### `helmet`
Ajoute des en-têtes de sécurité.

### `morgan`
Peut servir à journaliser les requêtes HTTP.

### `multer`
Prévu pour la gestion d’upload de fichiers.

## Dépendances de développement

### `jest`
Framework de test.

### `ts-jest`
Adaptateur TypeScript pour Jest.

### `supertest`
Permet de tester les routes HTTP Express.

### `@types/*`
Types TypeScript pour les bibliothèques utilisées.

### `typescript`
Le compilateur TypeScript.

### `tsx`
Permet de lancer le serveur TypeScript en mode développement.

### `jest-html-reporter`
Génère un rapport HTML des tests.

### `eslint` et `prettier`
Outils de lint et de formatage.

## Pourquoi ces dépendances sont importantes

Elles couvrent les besoins du backend :
- API HTTP
- base de données
- authentification
- validation des données
- documentation OpenAPI
- tests automatisés
- développement TypeScript
