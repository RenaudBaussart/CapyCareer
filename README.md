# CapyCareer

Application Full-Stack (React, Node.js/Express, TypeScript, n8n, MySQL) pour centraliser et gérer des offres d'emploi.

## Prérequis
- Docker et Docker Compose
- Node.js (pour l'autocomplétion locale de votre éditeur)

## Configuration
Créez un fichier `.env` à la racine avec ces variables :

```env
CLIENT_PORT=5xxx
VITE_API_URL=http://localhost:5xxx/api

SERVER_PORT=3xxx
OVH_DB_HOST=votre_hote
OVH_DB_USER=votre_user
OVH_DB_PASSWORD=votre_mdp
OVH_DB_NAME=votre_db
OVH_DB_PORT=3xxx
WLD_API_KEY=votre_cle

N8N_APP_PORT=5xxx
N8N_APP_HOST=x.x.x.x
N8N_APP_PROTOCOL=http
N8N_APP_NODE_ENV=production
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=votre_mdp_n8n

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