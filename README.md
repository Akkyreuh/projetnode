# API de Commerce Électronique - Node.js

## Description
Cette API RESTful permet de gérer les produits, les clients et les commandes d'un système de commerce électronique.

## Routes API

### Gestion des Produits

        Action                | Méthode | Point final                     | Description                   |
------------------------------|---------|---------------------------------|-------------------------------|
Créer un produit              | POST    | `/api/products`                 | Ajouter un nouveau produit    |
Obtenir tous les produits     | GET     | `/api/products`                 | Récupérer tous les produits   |
Obtenir le produit par id     | GET     | `/api/products/:id`             | Récupérer un seul produit     |
Mettre à jour le produit      | PUT     | `/api/products/:id`             | Modifier un produit existant  |
Supprimer le produit          | DELETE  | `/api/products/:id`             | Supprimer un produit          |
Rechercher un produit par nom | GET     | `/api/products/search?query=nom`| Rechercher un produit par nom |



### Gestion de la clientèle

        Action               | Méthode | Point final               | Description                      |
-----------------------------|---------|---------------------------|----------------------------------|
Créer un client              | POST    | `/api/customers`          | Ajouter un nouveau client        |
Obtenir des clients          | GET     | `/api/customers`          | Récupérer des clients            |

### Gestion des commandes 

        Action               | Méthode | Point final               | Description                      |
-----------------------------|---------|---------------------------|----------------------------------|
Créer une commande           | POST    | `/api/orders`             | Ajouter un nouveau produit       |
Obtenir la commande par ID   | GET     | `/api/orders/:id`         | Récupérer tous les produits      |
Mettre à jour la commande    | PUT     | `/api/orders/:id`         | Modifier un produit existant     |
Supprimer la commande        | DELETE  | `/api/orders/:id`         | Supprimer un produit             |

### Commande directe

        Action                     | Méthode | Point final                      | Description                                |
-----------------------------------|---------|----------------------------------|--------------------------------------------|
Passer une commande pour le client | POST    | `/api/orders/direct/:customerId` | Créer une commande pour un client existant |

## Docker
### Commandes docker pour développer le backend de l'application
Pour le développement de l'application, nous avons utilisé Docker de la manière suivante :

1. Création de l'image Docker à partir du Dockerfile fourni :
    ```bash
    docker build -t my-node-app .
    ```

2. Création d'un network pour la base de données :
    ```bash
    docker network create networknode
    ```

3. Lancement d'un conteneur basé sur l'image créée avec un alias réseau et un montage pour le développement :
    ```bash
    docker run -it --name conteneurnode --network networknode --network-alias conteneurnode -p 5201:5000 --mount type=bind,src=$(pwd),target=/app my-node-app zsh
    ```
4. Création et lancement du conteneur MongoDB pour la base de données :
    ```bash
    docker run -d --network networknode --network-alias databasenode --name databasenode mongo:latest
    ```

5. Démarrage du conteneur de développement :
    ```bash
    docker start conteneurnode
    ```
6. Accéder au conteneur de développement et naviguer dans le répertoire de l'application :
    ```bash
    docker exec -it conteneurnode zsh
    cd app
    ```

Ce setup permet de lier le répertoire local au conteneur, facilitant ainsi le développement en direct tout en maintenant une connexion active avec MongoDB dans le même réseau Docker.

### Commandes docker pour que l'utilisateur exécute les conteneurs

```bash
chmod +x run.sh
./run.sh
```

## Pour la base de données 

MONGO_URI="mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}"
PORT=${PORT}

## Bonus

- Gestion des erreurs (Identifiants invalides, champs manquants, validation des stocks)
- Recherche de produit par id
- Pagination du GET/products
