# CapyCareer - Job Aggregator

## Contexte du projet
Bienvenue sur **CapyCareer** ! 
CapyCareer est une plateforme d'agrégation d'offres d'emploi et de stages conçue pour simplifier la recherche des candidats. Notre solution collecte des annonces issues de sources externes, les standardise et les centralise pour offrir une véritable aide à la décision.  

Ce projet illustre notre savoir-faire transversal : conception produit, développement fullstack, déploiement conteneurisé, ainsi que l'intégration concrète de fonctionnalités Data et d'Intelligence Artificielle

## Notre Vision & Étude de Marché

L'analyse de l'écosystème du recrutement (acteurs généralistes dominants, complexité des interfaces et surcharge cognitive des candidats) a mis en évidence un besoin fort de simplicité et d'éthique, particulièrement au sein de la communauté Tech.

CapyCareer a été pensé comme un agrégateur **"Stress-free" et éthique**, conçu pour répondre à ces problématiques à travers trois piliers issus de notre étude de marché :

1. **Transparence et Conformité RGPD** : Face à l'opacité des plateformes traditionnelles, nous offrons une transparence totale avec une gestion des données personnelles native et accessible en libre-service (consultation, export JSON et droit à l'oubli).

2. **Centralisation et Fiabilité (WeLoveDevs & n8n)** : Une agrégation automatisée et éthique des offres du marché Tech via l'utilisation de flux et d'API officielles, garantissant des données de qualité sans pratiques de scraping sauvages.

3. **Expérience Candidat et IA** : L'intégration d'une intelligence artificielle légère pour automatiser l'analyse des annonces, extraire les compétences clés et proposer des recommandations ultra-ciblées afin de réduire la charge mentale du candidat.


## Équipe de Développement
La squad derrière CapyCareer :

* [Jonathan Decroix](https://github.com/jonathandecroix28-max) - Développeur Back-end & Sécurité
* [Vincent Lesniak](https://github.com/VincentLesniak) - Développeur Back-end & Git Master
* [Renaud Baussart](https://github.com/RenaudBaussart) - Développeur Back-end & Administrateur Base de Données
* [Lohan Lefèvre](https://github.com/LohanL3F) - Développeur Front-end & UI/UX Designer
* [Alison Dehaies](https://github.com/Meegy-exe) - Développeuse Front-end & Accessibilité

## Stack technique

| Catégorie | Technologies |
|------------|--------------|
| **Front-end** | React 19, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, React Quill, Lucide React |
| **Back-end** | Node.js, Express 5, TypeScript, MySQL, JWT, Bcrypt, Multer |
| **Sécurité** | Helmet, Express Rate Limit, DOMPurify, Sanitize-HTML, Validator, Leo Profanity |
| **Documentation & Tests** | Swagger (OpenAPI), Jest, Supertest |
| **Outils** | ESLint, Prettier, Concurrently |

## Prérequis

L'application est entièrement conteneurisée. Pour l'exécuter, les outils suivants sont nécessaires :

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Node.js *(optionnel, uniquement pour bénéficier de l'autocomplétion et des fonctionnalités de développement de votre éditeur)*


## Variables d'environnement

Toutes les données sensibles sont protégées. Pour lancer le projet, vous devez configurer vos variables d'environnement :

1. Consultez le fichier [`/.env.example`](./.env.example) présent à la racine du projet (ainsi que celui situé dans [`/server/.env.example`](./server/.env.example), si applicable).
2. Créez vos propres fichiers `.env` aux emplacements requis.
3. Renseignez les différentes variables (configuration de la base de données, clés JWT, API WeLoveDevs, etc.).

## Installation & Lancement
L'architecture sépare le code client (Front-end), le code serveur (Back-end), l'automatisation (n8n) et la base de données. Tout est orchestré via Docker Compose.

À la racine du projet, lancez simplement la commande suivante pour construire et démarrer toute la stack en local :
```docker-compose up --build```

## Accès aux services

Les services sont accessibles localement une fois l'environnement démarré. Les adresses ci-dessous sont données à titre d'exemple :

| Service | Exemple d'accès |
|---------|------------------|
| **Frontend (React)** | `http://localhost:5xxx` |
| **Backend API (Express)** | `http://localhost:5xxx` |
| **Automatisations (n8n)** | `http://localhost:5xxx` |

> **Remarque :** Les ports et les adresses exacts sont définis par la configuration de l'environnement (`.env` et Docker) et peuvent varier selon le contexte d'exécution.


## Initialisation du workflow n8n

Pour mettre en place le pipeline d'ingestion de données :

1. Accédez à l'interface de n8n via l'URL ci-dessus.
2. Dans le menu latéral, allez dans **Workflows** puis cliquez sur **Add Workflow**.
3. Cliquez sur le menu d'options en haut à droite de l'éditeur (souvent représenté par trois points) et choisissez **Import from File**.
4. Sélectionnez le fichier de schéma JSON situé dans le dossier `n8n/` de ce dépôt.
5. Une fois importé, configurez vos *Credentials* (Authentification Header pour WeLoveDevs et identifiants MySQL pour OVH) pour lier les nœuds à vos variables d'environnement.
6. Basculez le workflow en statut **Actif** (bouton en haut à droite) afin qu'il fonctionne de manière autonome en arrière-plan.


---

## Structure du Projet

L'arborescence principale s'organise de la manière suivante :

- **/client** : Interface candidat en React.js / Vite / Tailwind.
- **/server** : L'API REST sécurisée, logique métier et intégration IA.
- **/n8n** : Workflows d'automatisation et d'ingestion de données.
- **/documentation** : Regroupe l'intégralité des documents de conception, de sécurité et d'études de marché.
- **/ADR_Documentation** : Architecture Decision Records justifiant nos choix techniques.

---


## Qualité & Sécurité

Pour garantir un outil fiable et respectueux des données, nous avons mis en place plusieurs mesures de sécurité conformes aux exigences du projet :

- **Sécurité des données** : Les mots de passe sont hachés avec bcrypt, l'authentification est gérée par des tokens JWT, et toutes les données entrantes sont validées.

- **Tests** : Les routes API sont testées de manière automatisée à l'aide de Jest et Supertest.

- **CI/CD** : Nous utilisons GitHub Actions comme système d'intégration continue. Notre pipeline s'exécute automatiquement sur les Pull Requests pour vérifier les builds, le linting et exécuter les tests.

---

## Lancement des tests (Local)

Placez-vous dans le dossier **/server** et lancez :

```bash
npm test
```

Cette commande exécute la suite de tests Jest/Supertest pour vérifier l'intégrité de l'API.

---

## Documentation Complète

Pour que tout soit facilement accessible et auditable, nous avons centralisé tous les livrables dans le dossier [`/documentation`](./documentation). Vous y trouverez :

- [`01_data_base`](./documentation/01_data_base) : Schémas et modèles documentés de la base de données.
- [`02_backend`](./documentation/02_backend) : Documentation de l'API REST.
- [`03_tests`](./documentation/03_tests) : Documentation relative aux tests et à leur exécution.
- [`04_config`](./documentation/04_config) : Documentation de configuration du projet.
- [`05_cybersecurite`](./documentation/05_cybersecurite) : Documentation des mesures de sécurité et de gestion des secrets.
- [`06_market_research`](./documentation/06_market_research) : Étude de marché, positionnement concurrentiel et justification de la proposition de valeur.
- [`ADR_Documentation`](./documentation/07_adr_documentation/) : Architecture Decision Records expliquant les choix techniques (Why, How, Trade-offs) concernant l'IA, la data et l'architecture générale.
