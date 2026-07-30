# Choix de la Stack Technique et de l'Infrastructure

## 1. Langages et frameworks

### TypeScript

TypeScript a été retenu afin d'améliorer la fiabilité et la maintenabilité du projet grâce au typage statique.

Ses principaux avantages sont :

- détection des erreurs dès la phase de développement ;
- réduction des erreurs à l'exécution ;
- meilleure autocomplétion et navigation dans le code (IntelliSense) ;
- documentation implicite des structures de données ;
- facilité de maintenance lors des évolutions du projet.

L'utilisation de TypeScript contribue ainsi à produire un code plus robuste et plus facilement évolutif.

---

### React

React a été choisi pour développer l'interface utilisateur sous la forme d'une **Single Page Application (SPA)**.

Son architecture basée sur les composants permet de :

- réutiliser les éléments d'interface (cartes d'offres, modales, formulaires, etc.) ;
- limiter les duplications de code ;
- améliorer la maintenance de l'application ;
- offrir une navigation fluide sans rechargement de page.

Cette approche améliore l'expérience utilisateur tout en simplifiant les évolutions futures.

---

### HTML et CSS

L'utilisation des standards HTML5 et CSS3 permet de conserver une maîtrise complète de la structure et de la présentation de l'application.

Associés à Tailwind CSS, ils offrent :

- une interface responsive ;
- un design cohérent ;
- une meilleure accessibilité conformément aux recommandations WCAG ;
- une maintenance simplifiée des styles.

---

## 2. Innovation et automatisation

### Ollama

Ollama a été retenu comme solution d'exécution locale de modèles de langage (LLM).

Contrairement à des services hébergés tels que l'API OpenAI, cette solution présente plusieurs avantages :

- les données restent hébergées localement ;
- aucune dépendance à un service tiers payant ;
- maîtrise complète des traitements réalisés ;
- meilleure confidentialité des données échangées.

Ce choix répond également aux exigences liées à la protection des données personnelles.

---

### n8n

n8n est utilisé comme outil d'orchestration des processus automatisés.

Il permet de créer graphiquement des workflows reliant différents services ou applications sans développer l'ensemble de la logique métier manuellement.

Les principaux bénéfices sont :

- automatisation de tâches répétitives ;
- intégration facilitée avec des API externes ;
- meilleure lisibilité des processus ;
- maintenance simplifiée des automatisations.

---

## 3. Base de données

### MySQL

MySQL a été choisi comme système de gestion de base de données relationnelle.

Ce choix est adapté aux besoins de CapyCareer, dont les données présentent de nombreuses relations :

- utilisateurs ;
- rôles ;
- offres d'emploi ;
- candidatures ;
- favoris.

Les principaux avantages sont :

- intégrité référentielle grâce aux clés étrangères ;
- cohérence des données ;
- performances adaptées aux traitements transactionnels ;
- compatibilité avec les requêtes préparées utilisées contre les injections SQL.

---

## 4. Infrastructure et déploiement

### OVHcloud

Le déploiement de l'application est réalisé sur une infrastructure distante hébergée par OVHcloud.

Ce choix répond à plusieurs objectifs :

- hébergement des données au sein de l'Union européenne ;
- conformité facilitée avec le RGPD ;
- maîtrise de l'infrastructure d'hébergement ;
- disponibilité et évolutivité de la plateforme.

Dans le contexte d'une plateforme de recrutement manipulant des données personnelles (identité, adresses e-mail, profils, CV), ce choix contribue à renforcer la sécurité et la conformité réglementaire.