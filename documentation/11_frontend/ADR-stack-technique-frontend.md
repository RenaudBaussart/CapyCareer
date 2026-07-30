# ADR : Stack Technique et Dépendances Front-end

## 1. Contexte

Pour le développement de l'interface candidat et administrateur de **CapyCareer**, il était nécessaire de mettre en place une application web réactive. 
L'application doit gérer des formulaires complexes (profils, filtres de recherche), de l'authentification basée sur des jetons (JWT), ainsi que l'affichage sécurisé de données riches (descriptions d'offres), tout en garantissant une excellente expérience utilisateur et un temps de chargement minimal.

---

## 2. Décisions et Justifications

### 2.1. Cœur de l'application : React (v19) & Vite

**Dépendances :**
- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`

**Justification :**

React a été choisi pour son architecture basée sur les composants, favorisant la réutilisabilité des éléments d'interface (par exemple `JobCard` ou `MainNavbar`).

Vite a été préféré à Create React App ou Webpack comme outil de développement et de build grâce à son démarrage quasi instantané et à son **Hot Module Replacement (HMR)** très rapide, ce qui améliore considérablement la productivité pendant le développement.

---

### 2.2. Routage client : React Router DOM

**Dépendance :**
- `react-router-dom`

**Justification :**

React Router DOM est la solution standard de l'écosystème React pour gérer la navigation côté client sans rechargement de page.

Il permet notamment de :

- gérer les routes publiques et privées ;
- protéger les pages réservées aux utilisateurs authentifiés ;
- contrôler l'accès aux fonctionnalités d'administration selon le rôle de l'utilisateur.

---

### 2.3. Gestion des formulaires et validation : React Hook Form & Zod

**Dépendances :**
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

**Justification :**

**React Hook Form** a été retenu pour ses excellentes performances. Contrairement aux formulaires contrôlés classiques de React, il limite les re-rendus des composants lors de la saisie, ce qui améliore la fluidité de l'interface.

**Zod** permet de définir des schémas de validation fortement typés. Couplé à React Hook Form via `@hookform/resolvers`, il valide les données côté client avant leur envoi à l'API.

Cette approche permet notamment de :

- vérifier le format des adresses e-mail ;
- imposer des règles sur les mots de passe ;
- afficher immédiatement des messages d'erreur explicites ;
- réduire le nombre de requêtes invalides envoyées au serveur.

---

### 2.4. Sécurité et rendu de texte riche : React-Quill & DOMPurify

**Dépendances :**
- `react-quill-new`
- `dompurify`

**Justification :**

**React-Quill** fournit un éditeur de texte riche (WYSIWYG) destiné aux administrateurs pour créer et modifier les descriptions des offres d'emploi.

Le contenu produit étant du HTML, son affichage représente un risque potentiel d'attaque **XSS (Cross-Site Scripting)**.

**DOMPurify** est utilisé avant tout rendu HTML afin de supprimer les balises ou attributs dangereux susceptibles d'exécuter du code malveillant dans le navigateur.

Cette bibliothèque constitue ainsi une protection essentielle contre les attaques XSS.

---

### 2.5. Design et interface utilisateur : Tailwind CSS & Lucide React

**Dépendances :**
- `tailwindcss`
- `lucide-react`

**Justification :**

**Tailwind CSS** repose sur une approche utilitaire permettant de construire rapidement une interface cohérente directement dans les composants.

Ses principaux avantages sont :

- une réduction de la taille du CSS généré grâce au *tree shaking* ;
- une maintenance simplifiée ;
- un design system homogène (couleurs, espacements, typographie).

**Lucide React** fournit une bibliothèque d'icônes SVG modernes, légères et facilement personnalisables via les classes Tailwind CSS.

---

### 2.6. Authentification et modération : JWT-Decode & Leo-profanity

**Dépendances :**
- `jwt-decode`
- `leo-profanity`

**Justification :**

**JWT-Decode** permet de décoder les informations présentes dans le jeton JWT (identifiant, rôle, etc.) directement côté client sans solliciter l'API.

Cela permet notamment :

- d'adapter rapidement l'interface selon le rôle de l'utilisateur ;
- d'afficher ou masquer certaines fonctionnalités ;
- d'améliorer la réactivité globale de l'application.

**Leo-profanity** est utilisé comme première étape de modération côté client afin de détecter ou filtrer les propos inappropriés dans certains champs (pseudo, biographie, etc.).

Cette validation ne remplace pas les contrôles serveur mais améliore l'expérience utilisateur en signalant immédiatement les contenus problématiques.

---

## 3. Conséquences

### Avantages

- Stack moderne et largement adoptée dans l'écosystème React.
- Excellentes performances grâce à Vite et React Hook Form.
- Validation robuste des données avec Zod.
- Protection contre les attaques XSS via DOMPurify.
- Interface cohérente et facilement maintenable grâce à Tailwind CSS.
- Architecture modulaire facilitant les évolutions futures.

### Inconvénients

- Multiplication de bibliothèques spécialisées nécessitant une veille régulière.
- Maintenance des dépendances indispensable afin de corriger les vulnérabilités de sécurité (par exemple via `npm audit`).
- Courbe d'apprentissage plus importante pour les nouveaux développeurs en raison du nombre d'outils utilisés.