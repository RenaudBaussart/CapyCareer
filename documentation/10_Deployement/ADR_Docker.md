## Environnement d'exécution (Docker)

* **Décision :** Utilisation de Docker et Docker Compose pour la conteneurisation de la plateforme.

* **Why (Pourquoi) :** Le cahier des charges impose une expérience d'exécution où l'ensemble de la stack (frontend, backend, base de données) doit pouvoir démarrer en local avec une seule commande. Cela garantit également un environnement iso-production pour l'ensemble des développeurs de l'équipe, évitant les conflits de versions logicielles sur les machines hôtes.

* **How (Comment) :** Création d'un fichier `docker-compose.yml` centralisant nos services. Configuration des réseaux internes pour la communication inter-conteneurs et montage de volumes pour assurer que la persistance des données survive au redémarrage des conteneurs.

* **Trade-off (Compromis) :** La conteneurisation ajoute une couche d'abstraction réseau. Le débogage des communications entre l'API, la base de données et les "runners" est plus complexe qu'une exécution native.

* **Preuves :** Le fichier `docker-compose.yml` présent à la racine du dépôt, ainsi que les instructions de lancement dans le `README.md`.