# Modéle de l'IA Qwen-2.5-1.5B

Le modèle **Qwen2.5-1.5B** développé par Qwen AI est un modèle de langage de grande taille (LLM) conçu pour la compréhension et la génération de texte. Il est basé sur l'architecture Transformer et a été entraîné sur un large corpus de données textuelles pour acquérir des compétences avancées en traitement du langage naturel.

En plus de ses capacités générales de traitement du langage, le modèle **Qwen2.5-1.5B** est également optimisé pour des tâches spécifiques telles que la génération de code, la résolution de problèmes mathématiques et la compréhension contextuelle complexe.

Elle supporte au total 29 langues, dont le français, l'anglais, l'espagnol, l'allemand, le chinois et le japonais. Cela permet au modèle de traiter efficacement des textes multilingues et de fournir des réponses pertinentes dans différentes langues.

Capable de générer plus 8 mille tokens, le modèle **Qwen2.5-1.5B** est particulièrement adapté pour des applications nécessitant la génération de texte longue et cohérente, telles que la rédaction d'articles, la création de contenu et la génération de dialogues.

> De plus est capable de générer des strucutures de données complexes, telles que des fichiers JSON, ce qui le rend utile pour des applications nécessitant une sortie structurée et organisée.

## Variantes du modèle

- **Qwen-2.5-1.5B** : Modèle de base avec 1.5 milliards de paramètres, optimisé pour la compréhension et la génération de texte.

- **Qwen2.5-1.5B-Instruct** : Modèle aligné par apprentissage par renforcement et SFT, prêt pour le chat et le suivi d'instructions complexes (génération de JSON, structuration de données).

- **Qwen2.5-Coder-1.5B(-Instruct)** : Spécialisé pour la génération, la correction et le raisonnement en programmation.

- **Qwen2.5-Math-1.5B(-Instruct)** : Spécialisé dans la résolution de problèmes mathématiques (avec du raisonnement par chaîne de pensée ou des outils intégrés).

## Lancement du modèle (local)

```bash
ollama run qwen2.5-1.5b
```

## Le Modelfile

Le fichier de modèle (modelfile) est un fichier JSON qui contient les informations nécessaires pour exécuter le modèle Qwen2.5-1.5B. Il inclut des détails tels que le nom du modèle, la version, les paramètres d'entrée et de sortie, ainsi que les configurations spécifiques pour l'optimisation et l'exécution du modèle.

