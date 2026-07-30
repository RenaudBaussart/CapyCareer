# Rapport d'Accessibilité - CapyCareer

Conformément aux exigences du projet, l'interface de **CapyCareer** respecte le niveau **WCAG 2.1 AA** sur l'ensemble des parcours clés, avec un focus particulier sur la page d'inscription.

## 1. Parcours clés audités
1. **Inscription** (`/register`)
2. **Connexion** (`/login`)
3. **Recherche d'offres et détail** (`/` et modales associées)

## 2. Résultats de l'Audit Automatisé (Page Inscription)
* **Outil utilisé** : Google Lighthouse / Axe DevTools.
* **Résultat global** : Score d'accessibilité de **100/100** sur le parcours d'inscription.
* **Rapport brut** : Le rapport JSON épuré et validé pour cette page est disponible dans le fichier `./docs/lighthouse-login-audit.json`.

## 3. Bonnes pratiques d'accessibilité appliquées (WCAG 2.1 AA)
* **Formulaires et Étiquettes** : 
  * Association stricte de chaque champ de saisie (`<input>`) avec une étiquette explicite (`<label>`) pour une restitution parfaite par les lecteurs d'écran.
  * Utilisation d'attributs d'autocomplétion valides (`autocomplete`) sur les champs du formulaire d'inscription.
* **Contraste des couleurs** : Respect des ratios minimaux (4.5:1) entre les textes de description, les labels et les arrière-plans.
* **Navigation au clavier** : 
  * Ordre de tabulation rigoureux et logique à travers tous les champs de l'écran d'inscription.
  * Indicateurs de focus clairement visibles sur les boutons et les inputs.