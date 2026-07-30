# Documentation Technique – Vulnérabilités et Sécurité de l'Authentification

## Introduction

Ce document présente plusieurs vulnérabilités courantes liées à l'authentification dans une application **Node.js / Express** utilisant **MySQL**. Il explique les failles présentes dans certaines routes de démonstration, les bonnes pratiques pour sécuriser les mots de passe ainsi que le rôle du front-end React en matière de sécurité.

---

# 1. Analyse du contrôleur Express

Le contrôleur contient plusieurs routes à vocation pédagogique permettant d'illustrer des vulnérabilités de sécurité fréquentes.

## 1.1 `insecureLoginDemo`

### Fonctionnement

Cette route récupère le champ `username` depuis `req.body` et l'insère directement dans une requête SQL par concaténation.

Exemple de requête vulnérable :

```typescript
const sql = `SELECT * FROM User_ WHERE username = '${username}'`;
```

### Vulnérabilité

Cette pratique ouvre la porte aux **injections SQL**.

Si un utilisateur envoie un identifiant contenant du code SQL, celui-ci est interprété par la base de données au lieu d'être considéré comme une simple valeur.

Exemple de payload :

```sql
' OR '1'='1
```

La requête devient alors :

```sql
SELECT * FROM User_
WHERE username = '' OR '1'='1';
```

Comme la condition `'1'='1'` est toujours vraie, la base de données retourne toutes les lignes de la table.

### Risques

- Contournement de l'authentification
- Divulgation des utilisateurs
- Fuite des emails
- Exposition des mots de passe hachés

---

## 1.2 `insecureRegisterDemo`

### Fonctionnement

Cette fonctionalité sert à démontrer l'importance du shema de validation et du nettoyage des entrées utilisateur lors de l'enregistrement.

sans le `sanitize-html` ou une validation stricte, les champs du register accepte les balises HTML et les scripts. Permettant une attaque XSS si ces données sont affichées dans le front-end.

Il laisse passer des données non nettoyées pour le prénom et le nom, ce qui peut mener à des attaques XSS si ces données sont affichées dans le front-end sans désinfection.

## 1.3 `bruteForceLoginDemo`

### Fonctionnement

Cette route recherche simultanément le nom d'utilisateur et le mot de passe via une requête SQL construite par concaténation.

Exemple :

```typescript
const sql =
`SELECT * FROM User_
 WHERE username='${username}'
 AND password='${password}'`;
```

### Vulnérabilités

Cette implémentation cumule plusieurs problèmes :

- concaténation SQL ;
- vulnérabilité aux injections SQL ;
- comparaison directe du mot de passe ;
- absence de vérification avec `bcrypt.compare()` ;
- sensible aux attaques par force brute.

---

# 2. Pourquoi hacher les mots de passe ?

Stocker des mots de passe en texte brut constitue une faille critique.

En cas de compromission de la base de données, tous les comptes utilisateurs deviennent immédiatement accessibles.

## Le hachage

Une fonction de hachage transforme un mot de passe en une empreinte cryptographique.

Exemple :

```
Mot de passe :
monMotDePasse123

Hash bcrypt :
$2b$10$...
```

Le processus est à sens unique :

- impossible de retrouver le mot de passe d'origine ;
- seule une comparaison entre hashs est réalisée.

---

## Le salage (Salt)

`bcrypt` ajoute automatiquement une valeur aléatoire appelée **salt** avant le hachage.

Cela permet notamment de :

- empêcher les attaques par Rainbow Tables ;
- produire des hashs différents pour deux utilisateurs ayant le même mot de passe.

Exemple :

```
Utilisateur A
Mot de passe : azerty123
Hash : $2b$10$abc...

Utilisateur B
Mot de passe : azerty123
Hash : $2b$10$xyz...
```

Les deux hashs sont totalement différents.

---

# 3. Sécuriser les requêtes SQL

## Mauvaise pratique

La concaténation directe des variables utilisateur :

```typescript
const sql =
`SELECT * FROM User_
 WHERE username='${username}'`;
```

Cette écriture est vulnérable aux injections SQL.

---

## Bonne pratique : requêtes préparées

Avec **mysql2**, on utilise des paramètres (`?`).

```typescript
const sql =
`SELECT PK_id,
        username,
        hashed_password
 FROM User_
 WHERE username = ?`;

const [rows] =
await attackPool.query(sql, [username]);
```

### Pourquoi cela protège ?

Le pilote **mysql2** sépare :

- la structure SQL ;
- les données utilisateur.

Même si l'utilisateur saisit :

```sql
' OR '1'='1
```

Cette valeur sera interprétée comme une simple chaîne de caractères et non comme du code SQL.

L'injection est donc neutralisée.

---

# 4. React et la sécurité

React protège principalement contre certaines attaques côté client, mais ne remplace jamais la sécurité du serveur.

## 4.1 Protection contre le XSS

Par défaut, React échappe automatiquement les variables insérées dans le JSX.

Exemple :

```jsx
<p>{user.username}</p>
```

Si la variable contient :

```html
<script>alert("XSS")</script>
```

React affichera :

```text
<script>alert("XSS")</script>
```

au lieu d'exécuter le script.

Cette protection réduit fortement les risques de **Cross-Site Scripting (XSS)**.

---

## 4.2 Cas où React devient vulnérable

### Utilisation de `dangerouslySetInnerHTML`

Exemple :

```jsx
<div dangerouslySetInnerHTML={{ __html: contenu }} />
```

Si `contenu` provient d'une source non fiable, un attaquant peut injecter du JavaScript.

Cette protection native est alors contournée.

---

### Sécurité uniquement côté client

Masquer un bouton dans React :

```jsx
{isAdmin && <DeleteButton />}
```

ne constitue pas une protection.

Un attaquant peut appeler directement l'API via :

- Postman ;
- curl ;
- Python ;
- toute autre requête HTTP.

Les contrôles d'autorisation doivent toujours être effectués côté serveur (Node.js / Express).

---

# 5. Démonstration d'une injection SQL

Dans le cadre d'un environnement de démonstration ou d'un test d'intrusion autorisé, une application vulnérable peut être utilisée pour illustrer les conséquences d'une concaténation SQL.

## Exemple de payload

```sql
' OR '1'='1
```

La requête :

```sql
SELECT *
FROM User_
WHERE username = '...';
```

devient :

```sql
SELECT *
FROM User_
WHERE username = ''
OR '1'='1';
```

La condition étant toujours vraie, la base de données retourne l'ensemble des enregistrements de la table.

Cela peut exposer :

- les identifiants ;
- les noms d'utilisateur ;
- les adresses e-mail ;
- les hashs des mots de passe.

Cette démonstration illustre l'importance des requêtes préparées et de la validation des entrées utilisateur.

---

# Bonnes pratiques à retenir

- Ne jamais concaténer des données utilisateur dans une requête SQL.
- Utiliser systématiquement des requêtes préparées (`?`).
- Hacher les mots de passe avec `bcrypt`.
- Vérifier les mots de passe avec `bcrypt.compare()`.
- Mettre en place une limitation des tentatives de connexion (anti brute force).
- Sanitiser et valider toutes les entrées utilisateur côté serveur.
- Valider toutes les données reçues par l'API.
- Ne jamais faire confiance au front-end.
- Vérifier les droits d'accès uniquement côté serveur.
- Éviter `dangerouslySetInnerHTML` ou désinfecter le contenu HTML avant affichage.
