<div align="center">

*Read this in other languages: [English](README.md), [Français](README.fr.md)*

# 🌐 Tulk - La Plateforme Sociale Premium Nouvelle Génération

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Ligne-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Frontend Stack" />
  <img src="https://img.shields.io/badge/Backend-Laravel%2010%20%7C%20MySQL-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Backend Stack" />
  <img src="https://img.shields.io/badge/Design-Glassmorphism-purple?style=for-the-badge" alt="Design System" />
</p>

**Vivez le réseau social réinventé. Tulk associe une interface utilisateur époustouflante (Glassmorphism) à des capacités backend robustes en temps réel pour offrir une expérience fluide, inclusive et haut de gamme.**

### 🚀 [**DÉMO EN LIGNE : tulk-phi.vercel.app**](https://tulk-phi.vercel.app)

</div>

---

## 📖 Table des Matières
- [🌟 Aperçu](#-aperçu)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🖼️ Galerie de l'Application](#-galerie-de-lapplication)
- [🛠️ Stack Technique & Architecture](#-stack-technique--architecture)
- [🚀 Installation Locale](#-installation-locale)
- [📡 API & Flux de Données](#-api--flux-de-données)
- [🤝 Contact & Crédits](#-contact--crédits)

---

## 🌟 Aperçu
**Tulk** est une plateforme sociale moderne, responsive et hautement sécurisée, conçue pour la nouvelle génération. Construite entièrement de zéro, elle présente une architecture hybride avancée séparant un frontend statique ultra-rapide (React déployé via Vercel Edge) d'une puissante API backend (Laravel hébergé chez Alwaysdata).

Notre mission est de favoriser un environnement numérique enrichissant où la connexion avec vos amis, le partage de moments et le réseautage se font de manière naturelle et visuellement spectaculaire.

---

## ✨ Fonctionnalités Principales

### 🎨 Design Premium UI/UX "Glassmorphism"
- **Thèmes Dynamiques :** Transition fluide entre le mode Clair et Sombre grâce à une architecture CSS sur mesure.
- **Glassmorphism :** Conteneurs floutés élégants, bordures lumineuses subtiles et arrière-plans dégradés spectaculaires.
- **Micro-interactions :** Animations fluides développées en CSS pur et icônes Lucide React.

### 💬 Chat en Temps Réel & Groupes
- **Discussions de Groupe :** Créez des groupes dynamiques, invitez des amis communs et partagez des images facilement.
- **Messages Privés :** Messages directs chiffrés et rapides.
- **Profils Rapides :** Cliquez sur l'avatar d'un utilisateur dans un chat pour voir un résumé en modale, sans perdre le contexte de votre conversation.

### 📱 Fil d'Actualité & Engagement
- **Fil Dynamique :** Scroll infini avec interactions instantanées.
- **Contenus Riches :** Support du texte, des hashtags et des uploads d'images HD (jusqu'à 5 Mo).
- **Discussions Imbriquées :** Système de commentaires multi-niveaux permettant des réponses structurées.

### 👥 Gestion Avancée du Réseau
- **Demandes d'Amis :** Validation d'amitié bilatérale.
- **Système d'Abonnement (Follow) :** Abonnement unilatéral pour suivre vos créateurs de contenus favoris.
- **Suggestions :** Un algorithme de suggestion intelligent basé sur les amis communs.

### 🔒 Sécurité de Niveau Entreprise
- **Authentification :** Sécurisée par Token via Laravel Sanctum avec expiration forcée.
- **Anti-Spam :** Rate Limiting avancé sur tous les endpoints critiques.
- **Résilience Mots de Passe :** Chiffrement robuste (Argon2/Bcrypt) et flux de réinitialisation via vérification d'email.

---

## 🖼️ Galerie de l'Application

Voici un aperçu de l'interface exceptionnelle de **Tulk** :

<div align="center">

| 📱 Fil d'Actualité | 👤 Tableau de Bord Profil |
|:---:|:---:|
| <img src="./assets/home.png" width="400" style="border-radius:12px; box-shadow: 0px 4px 15px rgba(0,0,0,0.2)"/> | <img src="./assets/profile.png" width="400" style="border-radius:12px; box-shadow: 0px 4px 15px rgba(0,0,0,0.2)"/> |
| *Découverte immersive de contenu* | *Panel personnel avec statistiques* |

| 💬 Messages de Groupes | 🔍 Détails et Relations |
|:---:|:---:|
| <img src="./assets/discussions.png" width="400" style="border-radius:12px; box-shadow: 0px 4px 15px rgba(0,0,0,0.2)"/> | <img src="./assets/profile-detail.png" width="400" style="border-radius:12px; box-shadow: 0px 4px 15px rgba(0,0,0,0.2)"/> |
| *Médias intégrés & Profils Rapides* | *Analyse des followers et amis communs* |

</div>

---

## 🛠️ Stack Technique & Architecture

Tulk repose sur une stricte séparation des préoccupations, en utilisant une architecture API-First pour garder le client totalement découplé de la couche de base de données.

### ⚛️ Frontend (Côté Client)
- **Framework :** React 18
- **Build Tool :** Vite 5 pour HMR instantané
- **Styling :** TailwindCSS 3 (Utility-first) + Variables CSS Vanilla (Thèmes)
- **Routage :** React Router v6
- **Hébergement :** Vercel Edge Network

### 🐘 Backend (Côté Serveur)
- **Framework :** Laravel 10.x
- **Langage :** PHP 8.2
- **Base de Données :** MySQL 8.0 (Schéma optimisé avec clés étrangères et suppressions en cascade)
- **Auth :** Laravel Sanctum (Stateful & Basé sur Token)
- **Hébergement :** Alwaysdata

---

## 🚀 Installation Locale

Vous souhaitez exécuter **Tulk** en local ? Suivez ces quelques étapes.

### Prérequis
- PHP >= 8.2 & Composer
- Node.js >= 18.x
- MySQL >= 8.0

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-username/tulk.git
cd tulk
```

### 2. Initialisation Backend
```bash
cd back
composer install
cp .env.example .env
php artisan key:generate

# Configurez votre base de données locale dans le fichier .env avant de migrer !
php artisan migrate --seed
php artisan storage:link

php artisan serve --port 8000
```

### 3. Initialisation Frontend
```bash
cd ../front
npm install
cp .env.example .env

# Assurez-vous que VITE_API_URL=http://localhost:8000/api est bien dans le .env
npm run dev
```

### 💡 Compte Utilisateur Test
Vous pouvez tester l'application en local avec le compte pré-créé :
- **Email :** `sissolionel@gmail.com`
- **Mot de passe :** `sisso2026` *(vérifiez votre config de DB si besoin)*

---

## 📡 API & Flux de Données

Tulk comporte plus de 40 endpoints RESTful distincts et ultra-sécurisés gérant des validations de ressources multiples.

- **Codes d'État (Statefulness) :** L'API communique les validations d'état via des codes HTTP classiques (`403 Interdit`, `401 Non Autorisé`, `404 Non Trouvé`).
- **Pagination :** Les requêtes du fil récupèrent des blocs minimums, réduisant fortement l'utilisation de la RAM et accélérant le temps de réponse.
- **Gestion des CORS :** Des configurations strictes (Cross-Origin) autorisent uniquement des déploiements spécifiques à exécuter des requêtes de type mutation.

---

## 🤝 Contact & Crédits

**Architecte & Développeur Lead :** Lionel Sisso  
**Email :** sissolionel@gmail.com  
**GitHub :** [@lionelsisso](https://github.com/lionelsisso)

<div align="center">
<br/>

**Réalisé avec passion et un dévouement au code propre.** 💜

*© 2026 Tulk Inc. Tous droits réservés.*
</div>
