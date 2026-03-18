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
3. Copy the `/back/.env.example` file and rename it to `.env`.
4. Update the `/back/.env` file with the appropriate environment variables.
5. Start the Docker containers with the following command:

   ```bash
   docker compose --env-file .env.docker.dev up
   ```

This will start the following services:

- PostgreSQL database
- Adminer for database management
- Express backend server
- Generate Prisma client and push the state from Prisma schema to the database
- Vite frontend server

To stop the containers, run the following `docker` command:

```bash
docker compose --env-file .env.docker.dev down
```

If changes occur in the files and it is necessary to rebuild the docker-compose, run the following command:

```bash
   docker compose --env-file .env.docker.dev up --build
```

Command to clean the docker cache if needed:

```bash
   docker system prune

   # Valid command with 'y' and press enter
```
