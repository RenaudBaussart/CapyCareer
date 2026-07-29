### ADR - Stratégie d'Intégration Continue (CI)

* **Ce qui est automatisé :**
Nous avons automatisé les processus de validation à chaque modification du code. Le pipeline exécute l'installation des dépendances, la compilation (Build) du client et du serveur, l'analyse statique du code (Linting) sur les deux environnements, et l'exécution des tests automatisés sur le backend.
* **Why (Pourquoi ces vérifications ont été sélectionnées) :**
L'objectif principal est d'empêcher tout code défectueux, mal formaté ou régressif d'atteindre la branche principale. Nous avons priorisé les vérifications de linting pour maintenir une base de code uniforme au sein de l'équipe.
* **How (Comment le pipeline protège la qualité) :**
Le pipeline est configuré via GitHub Actions et se déclenche automatiquement sur les événements `push` et `pull_request` vers la branche `main`. L'ensemble des jobs s'exécute sur des runners auto-hébergés (`runs-on: self-hosted`) pour répondre aux contraintes d'infrastructure.
* **Trade-off (Compromis) :**
* *Alternative rejetée :* Tout exécuter dans un seul gros job séquentiel.
* *Compromis accepté :* Nous avons choisi de séparer le workflow en plusieurs jobs distincts (`build-client`, `build-server`, `lint-client`, etc.) en utilisant la clé `needs` pour gérer les dépendances. Cela allonge légèrement le temps de configuration initiale et complexifie le fichier YAML, mais offre un gain de temps majeur à l'exécution (parallélisation de certains jobs) et permet d'identifier instantanément quelle étape exacte a échoué. Par ailleurs, nous avons fait le compromis de ne pas intégrer de tests automatisés sur le frontend dans un premier temps, afin de concentrer nos ressources sur la validation critique de la donnée côté serveur.

* **Preuves :**
* *Preuve 1 :* Fichier `.github/workflows/ci.yml`.
* *Preuve 2 :* Capture d'écran du terminal ou de l'interface GitHub Actions montrant un job de CI exécuté avec succès sur un runner `self-hosted`.