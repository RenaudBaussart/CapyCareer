# ADR Tableau de Bord (Fil d'offres)

## 1. Le problème utilisateur adressé

La recherche d'emploi traditionnelle est souvent longue et peu fluide. Les plateformes classiques présentent plusieurs difficultés qui dégradent l'expérience utilisateur.

### Perte de contexte

La consultation d'une offre ouvre généralement une nouvelle page, obligeant l'utilisateur à effectuer de nombreux allers-retours entre les résultats de recherche et le détail des annonces.

### Surcharge cognitive

Les listes d'offres mettent rarement en évidence les informations essentielles telles que :

- le type de contrat ;
- le niveau de salaire ;
- le mode de travail (présentiel, hybride ou télétravail).

L'utilisateur doit alors ouvrir chaque annonce pour comparer ces informations.

### Difficulté de suivi

Conserver les offres intéressantes nécessite souvent des favoris externes, des captures d'écran ou plusieurs manipulations, ce qui complexifie le suivi de la recherche.

---

## 2. Hypothèse de fonctionnalité

Le **Fil d'offres** constitue un espace centralisé destiné à rendre la recherche plus fluide.

L'hypothèse retenue est qu'une interface en **vue scindée (Master–Detail)** associée à des filtres dynamiques améliore la rapidité et le confort de navigation.

La fonctionnalité comprend :

- un système de filtres multicritères en temps réel (mots-clés, localisation, salaire, type de contrat, etc.) ;
- une interface affichant simultanément la liste des offres et le détail complet de l'annonce sélectionnée ;
- un système de favoris permettant de retrouver facilement les offres enregistrées dans l'onglet **Offres sauvegardées**.

---

## 3. Pertinence de cette approche

Cette solution répond directement aux principaux points de friction rencontrés lors d'une recherche d'emploi.

### Gain de temps

Grâce au fonctionnement en **Single Page Application (SPA)**, l'utilisateur consulte les détails d'une offre sans quitter la liste des résultats ni recharger la page.

### Meilleure lisibilité

Des badges visuels mettent immédiatement en évidence les informations importantes :

- CDI, CDD, Stage...
- Télétravail, Hybride ou Présentiel
- Niveau de rémunération
- Localisation

L'utilisateur peut ainsi comparer rapidement plusieurs offres.

### Fidélisation

L'ajout d'un bouton de sauvegarde directement sur les cartes d'offres et dans leur fiche détaillée encourage la création d'une sélection personnalisée.

Cette fonctionnalité facilite le retour ultérieur sur les annonces et favorise l'engagement des candidats sur la plateforme.

---

## 4. Mesure du succès

Le succès du tableau de bord sera évalué à l'aide des indicateurs suivants.

### Taux de conversion

Pourcentage d'utilisateurs cliquant sur le bouton **Postuler — Voir l'offre** après avoir consulté une annonce.

### Engagement des favoris

Nombre moyen d'offres ajoutées aux **Offres sauvegardées** au cours d'une session utilisateur.

### Utilisation des filtres

Pourcentage d'utilisateurs utilisant les filtres avancés (salaire, mots-clés, localisation, etc.) par rapport aux recherches simples.

### Temps moyen de session

Durée moyenne passée sur le **Fil d'offres**.

Une augmentation de cette durée peut traduire une navigation plus confortable et un intérêt accru pour les fonctionnalités proposées.