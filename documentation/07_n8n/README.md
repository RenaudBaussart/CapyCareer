# n8n Workflow: Agrégation et Tagging des Offres

Ce document décrit le workflow n8n utilisé dans le projet, dont la définition se trouve dans `/n8n/Job_Agreggator.json`.

## Vue d'ensemble

Le workflow automatise le processus de récupération des offres d'emploi depuis une API externe, leur nettoyage, leur stockage dans notre base de données, et enfin leur catégorisation (tagging) à l'aide d'un modèle de langage local (LLM).

Le workflow est composé de deux processus principaux :
1.  **Agrégation des offres** : Récupère les offres de l'API WeLoveDevs et les enregistre dans la table `Job_Offers`.
2.  **Tagging par IA** : Récupère les offres non catégorisées de la base de données et utilise un modèle Ollama local pour générer des tags pertinents.

Une capture d'écran du graphe du workflow est disponible ici : `/n8n/image.png`.

## Déclencheurs

Le workflow peut être lancé de trois manières :
*   **Planifié** : S'exécute automatiquement toutes les 30 minutes.
*   **Webhook manuel** : Peut être déclenché à la demande en envoyant une requête POST à l'URL du webhook `/refresh-capycareer`.
*   **Au démarrage** : S'exécute une fois au démarrage de l'instance n8n.

## Processus d'Agrégation

1.  **Récupération des données** : Envoie une requête GET à `https://epi-api.welovedevs.com/v1`, en paginant les résultats (100 par page).
2.  **Nettoyage des données (nœud `sanitize`)** :
    *   Supprime les emojis et les caractères spéciaux du titre et de la description.
    *   Retire les balises HTML et le markdown pour obtenir un texte propre.
    *   Standardise les types de contrat (ex: `permanent` devient `CDI`).
    *   Extrait les informations de localisation.
    *   Génère un `content_hash` (SHA-256) pour identifier de manière unique chaque offre.
3.  **Insertion en base de données (Upsert)** :
    *   Se connecte à la base de données MySQL du projet.
    *   Effectue une opération `UPSERT` sur la table `Job_Offers` : si une offre avec le même `content_hash` existe, elle est mise à jour ; sinon, elle est créée. Cela évite les doublons.

## Processus de Tagging par IA

Ce processus s'exécute après le flux d'agrégation.

1.  **Récupération des offres non taguées** : Le workflow interroge la table `Job_Offers` pour trouver jusqu'à 10 offres où la colonne `tag` est `NULL`.
2.  **Génération du Tag** : Pour chaque offre, il envoie la description à une instance locale du LLM Ollama.
3.  **Mise à jour de l'offre** : Met à jour la ligne de l'offre dans la table `Job_Offers` avec le tag retourné par le LLM.

## Installation et Configuration

Pour faire fonctionner ce workflow, vous devez configurer les "Credentials" (informations d'identification) suivants dans votre instance n8n :

*   **`httpHeaderAuth` pour WeLoveDevs** : Une clé d'API pour l'endpoint `https://epi-api.welovedevs.com`.
*   **`mySql`** : Les informations de connexion à la base de données de l'application (hôte, utilisateur, mot de passe, nom de la base).
*   **`ollamaApi`** : L'URL de base de votre instance Ollama locale (par exemple, `http://localhost:11434`).

## Étapes de Configuration Manuelle

Voici les étapes pour configurer l'environnement n8n et importer le workflow :

1.  **Lancement de l'environnement Docker :**
    - Assurez-vous que Docker est en cours d'exécution.
    - Lancez les services (incluant n8n, la base de données et Ollama) avec la commande :
      ```bash
      docker-compose up
      ```

2.  **Connexion à n8n :**
    - Ouvrez votre navigateur et accédez à l'interface de n8n, généralement `http://localhost:5678`.
    - Créez un compte administrateur si c'est votre première connexion.

3.  **Importation du Workflow :**
    - Dans l'interface n8n, allez dans la section des workflows.
    - Cliquez sur "Import from File" (Importer depuis un fichier).
    - Sélectionnez le fichier `n8n/Job_Agreggator.json` depuis la racine du projet pour importer le workflow d'agrégation.

4.  **Configuration des Credentials :**
    - Dans le menu de gauche, allez dans "Credentials" et cliquez sur "Add credential".
    - Vous devrez configurer les informations d'identification suivantes, qui sont requises par le workflow importé :

    - **a. API WeLoveDevs (WLD) :**
        - Type de credential : `Header Auth`
        - Nom : `httpHeaderAuth` (ou un nom de votre choix)
        - Nom du Header : `X-API-Key`
        - Valeur du Header : *[votre clé d'API WeLoveDevs]*

    - **b. Base de données MySQL :**
        - Type de credential : `MySQL`
        - Nom : `mySql` (ou un nom de votre choix)
        - Remplissez les champs : Hôte, Nom de la base de données, Utilisateur et Mot de passe. Les valeurs se trouvent généralement dans votre fichier `docker-compose.yml` ou `.env`.

    - **c. Modèle Ollama :**
        - Type de credential : `Ollama API`
        - Nom : `ollamaApi` (ou un nom de votre choix)
        - URL de base : `http://ollama:11434` (c'est le nom du service Docker, accessible depuis le conteneur n8n).

5.  **Activation du Workflow :**
    - Une fois le workflow importé et les credentials configurés, n'oubliez pas d'activer le workflow en basculant l'interrupteur "Active" en haut à gauche de l'éditeur de workflow.
