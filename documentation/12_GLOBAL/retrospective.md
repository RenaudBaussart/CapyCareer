# Rétrospective de fin de projet - CapyCareer

**Date :** 30/07/2026  
## Équipe de Développement

* [Jonathan Decroix](https://github.com/jonathandecroix28-max) - Développeur Back-end & Sécurité
* [Vincent Lesniak](https://github.com/VincentLesniak) - Développeur Back-end & Git Master
* [Renaud Baussart](https://github.com/RenaudBaussart) - Développeur Back-end & Administrateur Base de Données
* [Lohan Lefèvre](https://github.com/LohanL3F) - Développeur Front-end & UI/UX Designer
* [Alison Dehaies](https://github.com/Meegy-exe) - Développeuse Front-end & Accessibilité

---

## 1. Notre Vision

Au-delà de la simple réalisation technique d'un cahier des charges, nous avons pensé CapyCareer avec un objectif concret : créer un espace centralisé et fluide pour simplifier la recherche d'emploi des étudiants et des professionnels.

Notre plateforme a pour objectif de lever les frictions habituelles (surcharge cognitive, perte de contexte) en réunissant un fil d'offres pertinent, des filtres dynamiques et un suivi simplifié, afin de les aider à aborder leur recherche dans les meilleures conditions possibles.


---

## 2. Bilan global

Ce projet a été pour nous un vrai challenge technique et architectural.

Notre objectif était de concevoir un agrégateur d'offres complet avec une stack moderne (React/Vite côté client, Node/Express/MySQL côté serveur).

Aujourd'hui, nous sommes fiers d'avoir livré une application web fonctionnelle, sécurisée, respectueuse des normes d'accessibilité (WCAG), et intégrant des innovations fortes comme des workflows automatisés (n8n) et une intelligence artificielle locale (Ollama).

C'est l'aboutissement de notre travail où nous avons appris à transformer nos acquis en un produit concret et abouti.

---

## 3. Organisation & Méthodologie

Pour garantir la qualité et la fluidité du développement, nous avons mis en place une organisation structurée.

### Méthode Agile

Le travail a été structuré en sprints, et en gestion d'un backlog d'user stories. Pour valider le fonctionnement et la qualité de l'application, nous avons intégré des tests automatisés avec Jest, ainsi que des audits de conformité avec Axe DevTools et Lighthouse.

### Architecture technique

Nous avons mis en place une séparation stricte au sein d'un monorepo, en séparant les dossiers `client/` et `server/`.

### Git & Collaboration

Notre workflow imposait l'utilisation de branches dédiées par feature, l'obligation de passer par des Pull Requests accompagnées de Code Review et l'interdiction de pousser du code directement sur la branche `main`.

### Sécurité

Implémentation des middlewares d'authentification (JWT), du hachage (bcrypt), d'un rate-limiting, et d'une validation stricte des données (Zod) pour protéger l'application et les données des utilisateurs.

---

## 4. Ce qui a bien fonctionné

### Architecture et Stack

Le choix de séparer le client et le serveur dès le début du projet a facilité la maintenance et la compréhension du code. La vélocité de Vite a également fluidifié le développement front-end.

### Validation des données

L'utilisation de Zod pour la validation côté back-end, couplée à React Hook Form côté front-end, a été une réussite totale pour prévenir les bugs.

### Workflow Git

L'obligation de Code Review a permis de réduire les erreurs, d'assurer le respect des bonnes pratiques de sécurité (comme la prévention des failles XSS) et de limiter les conflits lors de la fusion des branches.

---

## 5. Difficultés rencontrées et Leçons apprises

### Accessibilité et Outils Tiers

Le respect strict des normes d'accessibilité (WCAG 2.1 AA) avec des librairies externes comme ReactQuill a été un défi. Cela nous a appris à manipuler le DOM (injection de labels ARIA) pour pallier les limites des boîtes noires externes.

### Documentation automatisée

La configuration initiale de Swagger/OpenAPI liée aux schémas Zod a demandé une grande rigueur technique et a ralenti les premiers développements. Avec le recul, cet effort initial a cependant garanti une documentation toujours à jour.

### Perspectives

Afin d'optimiser notre workflow, nous prévoyons pour les futurs projets une meilleure optimisation du Github Projects, pour permettre une meilleure visibilité des nombreuses tâches.