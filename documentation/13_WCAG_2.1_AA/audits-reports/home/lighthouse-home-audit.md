# Rapport d'Accessibilité - CapyCareer (Page d'Accueil)

Conformément aux exigences du projet, l'interface de **CapyCareer** respecte le niveau **WCAG 2.1 AA** sur la page d'accueil et de recherche (`/`).

## 1. Parcours clés audités

- **Recherche et fil d'offres** (`/` – page d'accueil et moteur de recherche d'emploi)

## 2. Résultats de l'audit automatisé

**Outils utilisés :**
- Google Lighthouse
- Axe DevTools

**Résultat global :**
- Score d'accessibilité de **100/100** sur la page d'accueil.

**Rapport brut :**
- Le rapport JSON épuré et validé pour cette page est disponible dans :
  ```
  ./docs/accessibility-home-audit.json
  ```

## 3. Bonnes pratiques d'accessibilité appliquées (WCAG 2.1 AA)

### Formulaires de recherche

- Tous les champs de recherche et filtres de la page d'accueil disposent d'identifiants et de libellés (`<label>`) adaptés afin d'être correctement interprétés par les lecteurs d'écran.

### Navigation au clavier

- Ordre de tabulation fluide et cohérent à travers le module de recherche et les différents éléments interactifs de la page d'accueil.