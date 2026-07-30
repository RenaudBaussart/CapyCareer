# Rapport d'Accessibilité - CapyCareer

Conformément aux exigences du projet, l'interface de **CapyCareer** respecte le niveau **WCAG 2.1 AA** sur l'ensemble des parcours clés, avec un focus spécifique sur la page de connexion.

## 1. Parcours clés audités
1. **Connexion** (`/login`)
2. **Recherche d'offres** (`/`)
3. **Détail d'une offre** (Modal et vue détaillée)

## 2. Résultats de l'Audit Automatisé (Page Connexion)
* **Outil utilisé** : Google Lighthouse / Axe DevTools.
* **Résultat global** : Score d'accessibilité de **100/100** sur la page de connexion.
* **Rapport brut** : Le rapport JSON épuré et validé pour cette page est disponible dans le fichier `./docs/lighthouse-login-audit.json`.

## 3. Bonnes pratiques d'accessibilité appliquées (WCAG 2.1 AA)
* **Formulaires et Étiquettes** : 
  * Association stricte de chaque champ de saisie (`<input>` pour le nom d'utilisateur et le mot de passe) avec une étiquette explicite (`<label>`).
  * Utilisation d'attributs d'autocomplétion valides pour faciliter la saisie via les gestionnaires de mots de passe.
* **Contraste des couleurs** : Respect des ratios minimaux (4.5:1) pour une lisibilité parfaite des textes et des messages d'erreur.
* **Navigation au clavier** : 
  * Ordre de tabulation rigoureux et logique à travers tout le formulaire de connexion.
  * Indicateurs de focus clairement visibles sur les boutons et les champs interactifs.