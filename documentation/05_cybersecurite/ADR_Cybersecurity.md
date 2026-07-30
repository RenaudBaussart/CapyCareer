# ADR : Bonnes Pratiques de Cybersécurité et Atténuation des Menaces

## Contexte

L'application est développée avec un backend Node.js/Express, un frontend React et une base de données MySQL. Elle gère l'authentification des utilisateurs, le traitement des données et la présentation des informations. Cette architecture, courante pour les applications web modernes, est exposée à des risques de sécurité importants si elle n'est pas correctement sécurisée. Les menaces clés incluent l'accès non autorisé aux données par injection SQL, la prise de contrôle de comptes par des attaques par force brute, et les attaques côté client comme le Cross-Site Scripting (XSS).

Pour garantir l'intégrité de notre application et protéger les données des utilisateurs, un ensemble formel de principes de sécurité doit être défini et respecté tout au long du développement. Cet ADR documente les pratiques de sécurité obligatoires pour atténuer ces vulnérabilités courantes.

## Décision

Nous adopterons une stratégie de défense en profondeur axée sur l'application des règles côté serveur et un traitement strict des données. Les mesures de sécurité suivantes sont obligatoires :

1.  **Prévenir l'Injection SQL avec les Requêtes Préparées :**
    - Toutes les requêtes de base de données qui incluent des données fournies par l'utilisateur **doivent** utiliser des requêtes préparées (aussi appelées requêtes paramétrées). La bibliothèque `mysql2` offre cette fonctionnalité en utilisant `?` comme marqueurs pour les valeurs.
    - **Pratique Interdite :** La concaténation ou l'interpolation directe des entrées utilisateur dans les chaînes de requêtes SQL est strictement interdite car elle expose l'application à l'injection SQL.

2.  **Stockage Sécurisé des Mots de Passe avec Bcrypt :**
    - Les mots de passe ne **doivent jamais** être stockés en texte clair. Ils doivent être hachés à l'aide d'un algorithme robuste et adaptatif.
    - Nous utiliserons **bcrypt** pour le hachage et le salage des mots de passe. `bcrypt.hash()` sera utilisé pour le stockage et `bcrypt.compare()` pour la vérification. La bibliothèque gère automatiquement la génération de sel, ce qui protège contre les attaques par tables arc-en-ciel.

3.  **Atténuer le Cross-Site Scripting (XSS) :**
    - **Nettoyage Côté Serveur :** Tout le contenu généré par l'utilisateur doit être validé et nettoyé sur le serveur *avant* d'être stocké ou envoyé au client. Des bibliothèques comme `sanitize-html` doivent être utilisées pour filtrer les balises HTML et les scripts malveillants.
    - **Protection Côté Client :** Nous nous appuierons sur le comportement de liaison de données par défaut de React (par ex., `{data}`) qui échappe automatiquement les entités et empêche l'exécution de scripts. L'utilisation de `dangerouslySetInnerHTML` est fortement déconseillée et nécessite une approbation explicite après avoir démontré que le contenu est correctement nettoyé côté serveur.

4.  **Mettre en Œuvre l'Autorisation et la Validation des Entrées Côté Serveur :**
    - **Autorisation :** Tous les contrôles d'accès (par ex., vérifier si un utilisateur est un administrateur) **doivent** être effectués côté serveur au sein des points de terminaison de l'API ou des middlewares. Les vérifications côté client sont uniquement à des fins d'UI/UX et n'offrent aucune sécurité réelle.
    - **Validation des Entrées :** Toutes les données reçues des clients (corps de la requête, paramètres, chaînes de requête) doivent être validées sur le serveur par rapport à un schéma strict pour s'assurer qu'elles respectent les formats et les contraintes attendus.

5.  **Protéger Contre les Attaques par Force Brute :**
    - Les points de terminaison liés à l'authentification doivent être protégés par une limitation de débit (rate limiting). Cela implique de limiter le nombre de tentatives infructueuses à partir d'une seule adresse IP sur une fenêtre de temps spécifique pour ralentir les attaques par devinette automatisées.

## Conséquences

### Positives
-   **Sécurité Améliorée :** Réduit systématiquement la surface d'attaque contre les vulnérabilités web les plus courantes et critiques.
-   **Protection des Données :** Protège les données sensibles des utilisateurs, en particulier les identifiants, contre la compromission en cas de violation de la base de données.
-   **Clarté pour les Développeurs :** Fournit des directives de sécurité claires et exploitables pour tous les développeurs, conduisant à un code plus cohérent et sécurisé.
-   **Confiance Accrue :** Une application plus sécurisée renforce la confiance des utilisateurs.

### Négatives
-   **Légère Surcharge de Développement :** La mise en œuvre de ces mesures de sécurité nécessite un effort et une attention supplémentaires pendant le développement. Par exemple, toutes les entrées doivent être validées, et la logique de limitation de débit doit être configurée et maintenue.
-   **Friction Potentielle pour l'Utilisateur :** Un limiteur de débit trop strict pourrait bloquer temporairement les utilisateurs légitimes qui ont oublié leur mot de passe.

### Neutres
-   **Nécessite une Formation Continue :** Les développeurs doivent se tenir informés de ces pratiques et les appliquer de manière cohérente. La sécurité est un processus continu, pas une configuration unique.
