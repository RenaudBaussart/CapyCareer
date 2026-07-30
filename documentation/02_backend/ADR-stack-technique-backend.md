# ADR : Stack Technique et Dépendances Back-end

## 1. Contexte

L'API REST de **CapyCareer** fournit des données de manière sécurisée, performante et fiable à l'application front-end :

- la gestion des secrets ;
- la protection contre les injections SQL et XSS ;
- la mitigation des attaques par force brute ;
- la sécurisation des routes et des sessions utilisateurs.

Le choix des dépendances back-end répond directement à ces contraintes techniques et de sécurité.

---

## 2. Décisions et Justifications

### 2.1. Cœur du serveur et accès à la base de données

**Dépendances :**

- `express`
- `mysql2`
- `dotenv`

**Justification :**

**Express** a été retenu pour construire l'API REST grâce à son architecture légère, son système de middlewares et son importante adoption dans l'écosystème Node.js.

**MySQL2** est utilisé pour communiquer avec la base de données relationnelle. Il prend en charge les requêtes préparées (*Prepared Statements*), qui constituent une protection essentielle contre les injections SQL.

**Dotenv** permet de charger les variables d'environnement contenant les informations sensibles (identifiants de base de données, clés secrètes, clés d'API), évitant leur présence dans le code source.

---

### 2.2. Sécurité et mitigation des attaques

**Dépendances :**

- `helmet`
- `cors`
- `express-rate-limit`
- `sanitize-html`
- `validator`

**Justification :**

**Helmet** configure automatiquement plusieurs en-têtes HTTP de sécurité afin de renforcer la protection de l'application contre différentes attaques (HSTS, protection contre le clickjacking, désactivation du MIME sniffing, etc.).

**CORS** limite les requêtes provenant uniquement des origines autorisées, empêchant les appels non désirés depuis des applications tierces.

**Express Rate Limit** protège les routes sensibles, notamment l'authentification, en limitant le nombre de requêtes autorisées par adresse IP durant une période donnée. Cette mesure contribue à réduire les attaques par force brute.

**Sanitize-html** nettoie le contenu HTML fourni par les utilisateurs afin de supprimer les balises potentiellement dangereuses.

**Validator** complète cette protection en vérifiant le format des données reçues (adresse e-mail, URL, chaînes de caractères, etc.) avant leur traitement.

---

### 2.3. Authentification et gestion des sessions

**Dépendances :**

- `bcrypt`
- `jsonwebtoken`

**Justification :**

**Bcrypt** est utilisé pour hacher les mots de passe avant leur stockage en base de données. Son mécanisme de salage (*salt*) intégré rend les attaques par dictionnaire ou par tables arc-en-ciel beaucoup plus difficiles.

**JsonWebToken (JWT)** permet de gérer des sessions utilisateurs sans stockage d'état côté serveur (*stateless authentication*). Les informations d'authentification sont signées avec une clé secrète afin de garantir leur intégrité.

---

### 2.4. Validation des schémas et documentation de l'API

**Dépendances :**

- `zod`
- `@asteasolutions/zod-to-openapi`
- `swagger-ui-express`

**Justification :**

**Zod** valide les données reçues par les routes de l'API (`req.body`, paramètres et requêtes). Toute requête ne respectant pas le schéma attendu est rejetée avant d'atteindre la logique métier.

Cette validation permet de :

- réduire les erreurs de traitement ;
- renforcer la sécurité des entrées ;
- garantir un format de données cohérent.

**Zod-to-OpenAPI** convertit automatiquement les schémas Zod en spécifications OpenAPI.

**Swagger UI Express** expose ensuite une documentation interactive de l'API, toujours synchronisée avec les schémas utilisés dans le code.

---

### 2.5. Traitement des fichiers et modération

**Dépendances :**

- `multer`
- `leo-profanity`

**Justification :**

**Multer** est le middleware utilisé pour gérer les requêtes `multipart/form-data`, nécessaires à l'envoi des fichiers tels que les avatars des utilisateurs.

**Leo-profanity** réalise une modération côté serveur sur les champs de texte libre (pseudonymes, biographies, etc.). Cette vérification complète celle effectuée côté client afin d'empêcher l'enregistrement de contenus inappropriés dans la base de données.

---

## 3. Conséquences

### Avantages

- Architecture sécurisée répondant aux principales menaces applicatives (injections SQL, XSS, force brute).
- Gestion sécurisée des mots de passe et des sessions utilisateurs.
- Validation systématique des données entrantes grâce à Zod.
- Documentation OpenAPI générée automatiquement et maintenue à jour.
- Architecture modulaire facilitant la maintenance et les évolutions futures.

### Inconvénients

- La définition des schémas Zod et de la documentation OpenAPI demande davantage de rigueur lors du développement.
- Le nombre de middlewares et de bibliothèques de sécurité augmente la complexité de la configuration initiale.
- Une veille régulière des dépendances est nécessaire afin d'appliquer rapidement les mises à jour de sécurité.