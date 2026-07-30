# Arborescence du Projet CapyCareer

Le projet est structuré sous forme de "monorepo" contenant à la fois le client (front-end), le serveur (back-end), la documentation et les outils d'automatisation.

```text
CapyCareer/
│
├── client/                     # APPLICATION FRONT-END (React + Vite)
│   ├── public/                 # Fichiers statiques (Favicon, robots.txt, etc.)
│   ├── src/                    # Code source principal
│   │   ├── assets/             # Images, polices, et ressources globales
│   │   ├── components/         # Composants React réutilisables (UI, Modales, etc.)
│   │   ├── context/            # Contextes React (gestion d'état global, Auth)
│   │   ├── data/               # Données statiques ou mocks
│   │   ├── guards/             # Composants de protection des routes (ex: RequireAuth)
│   │   ├── hook/               # Hooks React personnalisés (ex: useClickOutside)
│   │   ├── pages/              # Vues complètes de l'application (Accueil, Admin, etc.)
│   │   ├── schemas/            # Schémas de validation Zod (Utilisateurs)
│   │   ├── schemas-admin/      # Schémas de validation Zod (Administration)
│   │   ├── services/           # Fonctions d'appel à l'API backend (fetch/axios)
│   │   ├── utils/              # Fonctions utilitaires diverses
│   │   ├── App.jsx             # Composant racine
│   │   └── main.jsx            # Point d'entrée de l'application React
│   ├── Dockerfile              # Configuration Docker pour le client
│   ├── eslint.config.js        # Configuration du linter
│   ├── package.json            # Dépendances front-end
│   └── vite.config.js          # Configuration du bundler Vite
│
├── server/                     # API BACK-END (Node.js + Express + TypeScript)
│   ├── logs/                   # Fichiers de logs générés par le serveur (Winston/Morgan)
│   ├── scripts/                # Scripts utilitaires (ex: seed.js pour populer la DB)
│   ├── src/                    # Code source principal de l'API
│   │   ├── config/             # Fichiers de configuration (Base de données, variables d'env)
│   │   ├── core/               # Logique cœur (middlewares globaux, gestion d'erreurs)
│   │   ├── modules/            # Logique métier découpée par domaine (Controllers, Routes, Services)
│   │   ├── app.ts              # Configuration de l'application Express
│   │   ├── server.ts           # Point d'entrée et lancement du serveur HTTP
│   │   └── swagger.ts          # Configuration de la documentation d'API OpenAPI/Swagger
│   ├── tests/                  # Fichiers de tests (Jest)
│   │   └── setup.ts            # Configuration initiale des tests
│   ├── Dockerfile              # Configuration Docker pour le serveur
│   ├── jest.config.js          # Configuration du framework de test Jest
│   ├── package.json            # Dépendances back-end
│   └── tsconfig.json           # Configuration TypeScript
│
├── documentation/              # DOCUMENTATION DU PROJET (ADRs, Audits, Setup)
│   ├── 01_data_base/           # Modélisation de la base de données (MCD, MLD)
│   ├── 02_backend/             # Décisions techniques (ADR) et specs du serveur
│   ├── 03_tests/               # Rapports et stratégies de tests
│   ├── 04_config/              # Guides de configuration de l'environnement
│   ├── 05_cybersecurite/       # Mesures de sécurité mises en place (XSS, Brute force...)
│   ├── 06_market_research/     # Études de marché et concurrentielles
│   ├── 07_n8n/                 # Documentation des flux d'automatisation
│   ├── 08_ai_documentation/    # Explications sur l'intégration de l'IA (Ollama)
│   ├── 09_CI/                  # Intégration Continue (workflows GitHub Actions)
│   ├── 10_Deployement/         # Guide de déploiement (OVHcloud)
│   ├── 11_frontend/            # Décisions techniques (ADR) du client React
│   ├── 12_GLOBAL_ADR/          # Choix d'architecture globale et technologique
│   └── 13_WCAG_2.1_AA/         # Audits d'accessibilité (Axe DevTools) et de perf (Lighthouse)
│
├── n8n/                        # 🤖 AUTOMATISATION & IA
│   ├── Job_Agreggator.json     # Fichier d'export du workflow n8n
│   └── image.png               # Aperçu du workflow
│
├── docker-compose.yml          # Orchestration des conteneurs (Client, Serveur, DB, n8n)
├── Modelfile                   # Fichier de configuration du modèle IA local (Ollama)
├── package.json                # Scripts globaux du monorepo (Lancement conjoint front/back avec Concurrently)
└── README.md                   # Présentation principale du projet