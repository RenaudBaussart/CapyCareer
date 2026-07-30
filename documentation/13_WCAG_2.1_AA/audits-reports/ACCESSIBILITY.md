# Rapport Global d'Accessibilité - CapyCareer

Ce document atteste de la conformité de l'application web CapyCareer aux normes d'accessibilité numérique, avec pour cible le standard **WCAG 2.1 AA**.

## 1. Périmètre et Méthodologie d'Audit

L'évaluation a été réalisée de manière automatisée en combinant deux outils de référence du marché pour garantir une analyse exhaustive. Les tests se sont concentrés sur les trois parcours clés de la plateforme.

*   **Outils utilisés :** 
    *   **Google Lighthouse** (v13.3.0) : pour le calcul du score global, l'analyse des métadonnées et la validation des bonnes pratiques web.
    *   **Axe DevTools** (axe-core v4.12.1) : pour l'analyse experte du DOM, la vérification du contraste et la conformité stricte aux critères WCAG 2.1 AA.
*   **Dates des tests :** 30 juillet 2026
*   **Rapports bruts :** Les exports JSON épurés des audits sont archivés dans le répertoire `./docs/`.

---

## 2. Synthèse des Résultats par Parcours

Les tests combinés démontrent un score parfait sur Lighthouse et une absence totale d'erreurs d'accessibilité sur Axe DevTools pour les vues évaluées.

### 2.1. Page d'Accueil et Fil d'Offres (`/`)
*   **Lighthouse :** Score de 100/100
*   **Axe DevTools :** 0 violation détectée (0 critique, 0 sérieuse, 0 modérée, 0 mineure)
*   *Fichiers de référence : `lighthouse-home-audit.json`, `axedev-home-audit.json`*

### 2.2. Page d'Inscription (`/register`)
*   **Lighthouse :** Score de 100/100
*   **Axe DevTools :** 0 violation détectée (0 critique, 0 sérieuse, 0 modérée, 0 mineure)
*   *Fichiers de référence : `lighthouse-register-audit.json`, `axedev-register-audit.json`*

### 2.3. Page de Connexion (`/login`)
*   **Lighthouse :** Score de 100/100
*   **Axe DevTools :** 0 violation détectée (0 critique, 0 sérieuse, 0 modérée, 0 mineure)
*   *Fichiers de référence : `lighthouse-login-audit.json`, `axedev-login-audit.json`*

---

## 3. Bonnes Pratiques Implémentées (WCAG 2.1 AA)

Pour atteindre et maintenir ce niveau de conformité, le développement de l'interface graphique a intégré les principes d'accessibilité suivants :

*   **Sémantique HTML :** Utilisation rigoureuse des repères sémantiques (`<main>`, `<nav>`, `<header>`, `<footer>`) pour structurer logiquement la page et faciliter la navigation par lecteur d'écran.
*   **Accessibilité des Formulaires :** Chaque champ de saisie (barre de recherche, identification, mots de passe) est explicitement lié à une balise `<label>`, garantissant une restitution parfaite. Les attributs `autocomplete` pertinents sont renseignés.
*   **Navigation au Clavier :** Présence d'un ordre de tabulation logique (`Tab` / `Shift + Tab`) et maintien d'indicateurs de focus visuels évidents sur l'ensemble des éléments interactifs (boutons, liens, champs).
*   **Lisibilité et Contraste :** Respect systématique des ratios de contraste minimaux (4.5:1) entre les textes, les composants UI et les couleurs d'arrière-plan.