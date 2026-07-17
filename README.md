# CapyCareer

Application Full-Stack (React, Node.js/Express, TypeScript, n8n, MySQL) pour centraliser et gérer des offres d'emploi.

## Prérequis
- Docker et Docker Compose
- Node.js (pour l'autocomplétion locale de votre éditeur)

## Configuration
Créez un fichier `.env` à la racine avec ces variables :

```env
CLIENT_PORT=
SERVER_PORT=
VITE_API_URL=

OVH_DB_HOST=
OVH_DB_USER=
OVH_DB_PASSWORD=
OVH_DB_NAME=
OVH_DB_PORT=

WLD_API_KEY=
JWT_SECRET= 
SALTROUNDS=

N8N_APP_PORT=
N8N_APP_HOST=
N8N_APP_PROTOCOL=
N8N_APP_NODE_ENV=
N8N_BASIC_AUTH_ACTIVE=
N8N_BASIC_AUTH_USER=
N8N_BASIC_AUTH_PASSWORD=

N8N_RUNNERS_TASK_BROKER_URI=
N8N_RUNNERS_AUTH_TOKEN=
```

## Démarrage

Lancez l'infrastructure complète via Docker :

```
docker compose up --build
```

## Accès aux services

Frontend (React) : http://localhost:5xxx

Backend API (Express) : http://localhost:5xxx

Automatisations (n8n) : http://localhost:5xxx

## Initialisation du workflow n8n

Pour mettre en place le pipeline d'ingestion de données :

1. Accédez à l'interface de n8n via l'URL ci-dessus.
2. Dans le menu latéral, allez dans **Workflows** puis cliquez sur **Add Workflow**.
3. Cliquez sur le menu d'options en haut à droite de l'éditeur (souvent représenté par trois points) et choisissez **Import from File**.
4. Sélectionnez le fichier de schéma JSON situé dans le dossier `n8n/` de ce dépôt.
5. Une fois importé, configurez vos *Credentials* (Authentification Header pour WeLoveDevs et identifiants MySQL pour OVH) pour lier les nœuds à vos variables d'environnement.
6. Basculez le workflow en statut **Actif** (bouton en haut à droite) afin qu'il fonctionne de manière autonome en arrière-plan.