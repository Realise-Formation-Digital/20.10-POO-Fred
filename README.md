# POO-Fred

## Installation

1. Allez dans le dossier www et lancer composer

```
php composer.phar install
```

2. Ensuite, copier le fichier .env.example vers .env et modifier les informations de la base de données (Si vous êtes sur un autre environnement, ex. connexion données par votre hébergeur)

3. Lancer docker (En vérifiant préalablement que vous n'avez pas un docker existant qui utilise les port 9000 et 9001)

```
docker-compose up -d
```

4. Allez sur PHPMyAdmin (locahost:9000) pour importer la structure SQL du fichier game.sql

5. Lancer le jeu sur locahost:9001
