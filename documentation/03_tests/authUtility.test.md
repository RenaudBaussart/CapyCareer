# Tests - `authUtility`

Ce fichier décrit les tests du helper JWT situé dans `server/src/core/utils/authUtility.test.ts`.

## Objectif

Vérifier que `generatememberToken()` génère bien un token JWT valide à partir d’un payload membre.

## Ce qui est testé

### 1. Le token est bien une chaîne de caractères
Le test vérifie que :
- le retour est de type `string`
- la valeur n’est pas vide
- le token ressemble à un JWT classique

### 2. Le payload est correct
Le test décode le token avec `jsonwebtoken.verify()` et contrôle que le contenu contient :
- `id`
- `role`
- `isFirstLogin`

### 3. L’expiration est bien présente
Le test vérifie que le champ `exp` existe dans le token décodé.

## Intérêt du test

Ce test sécurise la génération des tokens car toute la partie authentification dépend de cette fonction.

## Résultat attendu

Si le test passe, cela confirme que :
- la clé JWT est correctement configurée
- la signature fonctionne
- le payload n’est pas perdu pendant la génération
