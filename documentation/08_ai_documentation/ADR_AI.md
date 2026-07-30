### ADR - Choix de la fonctionnalité IA (Modèle Qwen-2.5-1.5B)

* **Méthode / Modèle sélectionné :**
Nous avons choisi d'utiliser le modèle de langage local **Qwen2.5-1.5B** (spécifiquement sa variante *Instruct*, optimisée pour le suivi d'instructions complexes). Le modèle est exécuté et hébergé par nos soins à l'aide de l'outil Ollama.
* **Why (Pourquoi ce modèle et pourquoi il est léger) :**
Le cahier des charges exige une fonctionnalité IA légère et interdit formellement d'externaliser cette fonctionnalité vers une API de modèle que nous ne contrôlons pas. Avec 1,5 milliard de paramètres, Qwen2.5-1.5B est un modèle LLM très léger. Il garantit une faible consommation en ressources et des temps de réponse rapides. De plus, sa capacité native à générer des structures de données complexes, telles que des formats JSON, est un atout décisif pour interfacer de manière fiable ses prédictions avec notre backend. Enfin, son support natif du français (parmi 29 langues) est indispensable pour traiter efficacement les offres d'emploi de notre plateforme.


* **How (Comment l'IA est implémentée) :**
L'IA est déployée localement et lancée via la commande `ollama run qwen2.5-1.5b`. L'orchestration et le réglage fin se font via un `Modelfile` (fichier JSON configurant les paramètres d'entrée/sortie et l'optimisation de l'exécution). Nous exploitons sa fenêtre de contexte de 8 000 tokens pour traiter des descriptions d'offres d'emploi complètes et extraire les informations pertinentes de manière structurée.
* **Trade-off (Compromis et Limitations attendues) :**
* *Alternative rejetée :* L'utilisation de modèles ouverts mais beaucoup plus lourds (ex: modèles à 8B ou 70B de paramètres) ou le recours à des API propriétaires externes (interdit par les contraintes du projet).


* *Compromis accepté :* Le sujet souligne que la taille, la performance et la consommation en ressources des modèles évoluent proportionnellement. Nous avons donc accepté de sacrifier une légère marge de raisonnement profond (propre aux très gros modèles) au profit de la rapidité et de la faisabilité technique en local. Les limitations attendues concernent de potentielles hallucinations mineures si la description de l'offre fournie en entrée est trop ambiguë.


* *Approche d'évaluation :* Le succès du modèle sera mesuré par sa capacité à retourner des fichiers JSON valides à 100 % (sans erreur de parsing côté backend) et par un temps de réponse n'entravant pas l'expérience utilisateur sur le tableau de bord.


* **Preuves :**
* *Preuve 1 :* Fichier `Modelfile` présent dans la base de code.
* *Preuve 2 :* Capture d'écran illustrant un objet JSON d'extraction généré avec succès par Qwen2.5-1.5B sur une offre réelle.