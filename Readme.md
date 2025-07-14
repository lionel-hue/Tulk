# Instaconn! : un espace communautaire base sur facebook

---

- ### voir, liker, commenter sur les articles
- ### rechercher et discuter avec les amis
- ### voir votre profile etc

---

## **Les fonctionalites** qui marche pour l'instant

- ### voir les articles
- ### voir les profiles
- ### liker et commenter sur les articles
- ### se connecter et inscription

---

## Les membres du groupe

- SISSO Lionel Timileyin
- Tossougbo Mariel
- ODJO Immaculee

---

## Les exigences du projet

```
- php version >= 8.3.22
- xampp version 8.2.12-0 
```

## Guide d'usage

```
#cloner le repro
git clone https://github.com/lionel-hue/Instaconn.git

#renomer the ficihier .env.example en .env
.env.example => .env (linux : cp .env.example .env)

#saisir les informations du fichier .env pour la conn a la BDD
DB_HOST=Nom du host
HOST_USER=Nom d'utilisateur
HOST_PASS=Mot de passe
DB_NAME=Nom de la BDD
HOST_PORT=Port du host 

#demarrer l'application xampp 
#demarrer apache et mysql
#depuis phpmyadmin importer le fichier Instaconn.sql dans la bdd appele Instaconn(une sugesstion du nom de la bdd)

#demarrer php depuis le cli et allez sur le lien precise
php -S DB_HOST:HOST_PORT (acceder localhost:1024 depuis le navigateur)
```