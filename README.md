# BlablaBook – Frontend

BlablaBook est une application web permettant aux utilisateurs de gérer leur bibliothèque personnelle et de découvrir des nouveaux livres.
L’objectif est de créer un espace simple et intuitif pour suivre ses lectures, rechercher des ouvrages et consulter leurs informations.
Cette application inclut également une dimension communautaire, permettant aux utilisateurs de partager leurs lectures et recommandations avec leurs amis.

---

## Lancer le projet en local

Pour le frontend :

```bash
cd front
pnpm install
pnpm dev
```

## Running the Project with Docker

To launch the development environment using Docker, follow these steps:

1. Copy the `.env.docker.dev.example` file and rename it to `.env.docker.dev`.
2. Update the `.env.docker.dev` file with the appropriate environment variables.
3. Update the `docker:dev` script in the `back/package.json` file to start an Express server. For example:

   ```json
   "docker:dev": "tsx --watch index.ts"
   ```

4. Start the Docker containers with the following command:

   ```bash
   docker compose up --env-file .env.docker.dev
   ```

This will start the following services:

- PostgreSQL database
- Adminer for database management
- Express backend server
- Vite frontend server
