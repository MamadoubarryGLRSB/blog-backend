# Blog API - NestJS Backend

## Description
API RESTful pour une application de blog construite avec NestJS, Prisma et PostgreSQL. Cette API permet la gestion des articles, des commentaires, des utilisateurs et inclut un système d'authentification JWT.

## Fonctionnalités
- 👤 Authentification JWT
- 📝 CRUD des articles
- 💬 Système de commentaires
- ❤️ Système de likes
- 🔍 Recherche d'articles
- 🏷️ Gestion des tags
- 👥 Gestion des utilisateurs et profils

## Prérequis
- Node.js (v16 ou supérieur)
- PostgreSQL
- Docker & Docker Compose (pour l'environnement de développement)

## Technologies Utilisées
- NestJS - Framework backend
- Prisma - ORM
- PostgreSQL - Base de données
- JWT - Authentification
- Swagger - Documentation API
- Docker - Conteneurisation
- class-validator - Validation des données

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd blog-backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configuration environnement :
   - Copier le fichier `.env.example` en `.env`
   - Modifier les variables d'environnement selon votre configuration

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blog_db?schema=public"
JWT_SECRET="votre_secret_jwt"
```

4. Lancer la base de données avec Docker :
```bash
docker-compose up -d
```

5. Appliquer les migrations Prisma :
```bash
npx prisma migrate dev
```

6. (Optionnel) Charger les données de test :
```bash
npx prisma db seed
```

## Démarrage

1. Démarrer en mode développement :
```bash
npm run start:dev
```

2. Démarrer en mode production :
```bash
npm run build
npm run start:prod
```

## Structure du Projet
```
src/
├── articles/               # Module articles
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # Entités
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   └── articles.module.ts
├── auth/                  # Module authentification
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                 # Module utilisateurs
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/               # Configuration Prisma
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
└── app.module.ts         # Module principal
```

## API Endpoints

### Auth
- `POST /auth/login` - Connexion utilisateur

### Users
- `POST /users` - Création d'un utilisateur
- `GET /users` - Liste des utilisateurs
- `GET /users/:id` - Détails d'un utilisateur
- `PATCH /users/:id` - Modification d'un utilisateur
- `DELETE /users/:id` - Suppression d'un utilisateur

### Articles
- `POST /articles` - Création d'un article
- `GET /articles` - Liste des articles
- `GET /articles/:id` - Détails d'un article
- `PATCH /articles/:id` - Modification d'un article
- `DELETE /articles/:id` - Suppression d'un article
- `POST /articles/:id/like` - Like d'un article
- `DELETE /articles/:id/like` - Unlike d'un article
- `GET /articles/search` - Recherche d'articles

### Comments
- `POST /articles/:articleId/comments` - Ajout d'un commentaire
- `GET /articles/:articleId/comments` - Liste des commentaires
- `PATCH /articles/:articleId/comments/:id` - Modification d'un commentaire
- `DELETE /articles/:articleId/comments/:id` - Suppression d'un commentaire

## Documentation API
La documentation Swagger est disponible à l'adresse :
```
http://localhost:3000/api
```

