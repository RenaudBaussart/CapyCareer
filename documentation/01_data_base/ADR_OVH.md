
## Déploiement et Sécurisation de la Base de données (OVH Cloud)

* **Décision :** Hébergement de la base de données relationnelle sur une solution distante chez OVH Cloud, sécurisée par restriction d'IP, plutôt qu'exclusivement dans un conteneur Docker local.

* **Why (Pourquoi) :** Le projet requiert de collaborer en tant qu'équipe d'ingénierie unique. L'objectif était de fluidifier le travail d'équipe avec une base partagée (supprimant le besoin d'échanger des exports SQL) et un accès simplifié via un panel d'administration web. Il fallait également garantir la sécurité des données conformément aux exigences cybersécurité, sans imposer la configuration de connexions SSL complexes en local.

* **How (Comment) :** Création de la base sur l'infrastructure OVH. Les variables d'environnement (`.env`) pointent vers l'hôte distant. Pour la sécurité, une restriction stricte par adresse IP (whitelist) a été mise en place sur le pare-feu du serveur OVH, n'autorisant la connexion qu'aux adresses IP spécifiques des développeurs de l'équipe et de l'infrastructure de déploiement.

* **Trade-off (Compromis) :** Si la restriction d'IP réduit drastiquement la surface d'attaque, elle introduit une friction administrative de maintenance : il faut mettre à jour manuellement la configuration chez OVH si un membre de l'équipe change de réseau de travail. De plus, cette architecture maintient une dépendance stricte à une connexion internet pour le développement local.

* **Preuves :** Fichier de configuration `.env` pointant vers l'hôte OVH, et capture d'écran des règles de restriction IP configurées sur le panel distant.