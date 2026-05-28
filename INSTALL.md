# BlablaBook – Installation & Setup Guide

> **Complete development environment setup for BlablaBook**

This guide provides detailed instructions for setting up the BlablaBook development environment using Docker, including database configuration, migrations, and seeding.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Frontend Setup](#local-frontend-setup)
- [Docker Development Environment](#docker-development-environment)
- [Database Management](#database-management)
- [Default Development Users](#default-development-users)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Docker](https://www.docker.com/) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0 or later)
- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (recommended)

---

## Docker Development Environment

### Configuration

1. **Environment Files Setup**

   Copy and configure the environment files:

   ```bash
   # Frontend/Docker environment
   cp .env.docker.dev.example .env.docker.dev
   ```

   Edit `.env.docker.dev` and update all required environment variables for your local development.

   ```bash
   # Backend environment
   cp /back/.env.example /back/.env
   ```

   Edit `/back/.env` and configure the backend environment variables.

2. **Start Docker Containers**

   Launch all services with Docker Compose:

   ```bash
   docker compose --env-file .env.docker.dev up
   ```

   This command starts the following services:
   - **PostgreSQL Database** – Persistent database storage
   - **Adminer** – Web-based database management tool (accessible at `http://localhost:8080`)
   - **Express Backend Server** – REST API server
   - **Prisma Client** – Auto-generated database client
   - **Vite Frontend Server** – Development server with hot-reloading

3. **Stop Docker Containers**

   To stop all running containers:

   ```bash
   docker compose --env-file .env.docker.dev down
   ```

### Rebuilding Containers

If you make changes to configuration files or Dockerfiles, rebuild the containers:

```bash
# Rebuild with cache
docker compose --env-file .env.docker.dev up --build

# Force rebuild without cache
docker compose --env-file .env.docker.dev build --no-cache
```

### Docker Cache Management

To clean Docker cache when experiencing issues:

```bash
# Remove unused containers, networks, images, and build cache
docker system prune

# Confirm with 'y' when prompted
```

---

## Database Management

### Starting with a Clean Database

To completely reset your database and start fresh, follow these steps in order:

```bash
# 1. Remove Prisma client
rm -rf generated/

# 2. Remove existing migrations
rm -rf prisma/migrations/

# 3. Clear Docker cache
docker system prune -f

# 4. Remove all unused Docker volumes (CAUTION: this deletes ALL unused volumes)
docker volume prune -f

# 5. Remove the specific BlablaBook database volume
docker volume rm blabla-book_blablabook-db-volume

# 6. Start the Docker containers
docker compose --env-file .env.docker.dev up
```

### Prisma Migrations

Once containers are running, execute these commands **inside the backend service container**:

```bash
# Reset migrations (drops all database data)
pnpm prisma:migrate:reset

# Run development migration
# Prisma will prompt for a migration name (e.g., "init-db")
pnpm prisma:migrate:dev
```

### Database Seeding

To populate the database with sample data for development:

```bash
# Inside the backend service container
pnpm prisma:seed
```

### Database Reset

To clear the database and restore the initial dataset:

```bash
# Inside the backend service container
pnpm prisma:reset
```

> **Note**: This command drops all data and reapplies migrations and seed data.

---

## Default Development Users

After seeding the database, the following user accounts are created for development and testing purposes:

| Username | Email            | Password       |
| -------- | ---------------- | -------------- |
| John     | john@mail.com    | Password12345! |
| Paul     | paul@mail.com    | Password12345! |
| Ringo    | ringo@mail.com   | Password12345! |
| Georges  | georges@mail.com | Password12345! |

> **⚠️ Security Note**: These accounts use a common password for development convenience. **Never use these credentials in production.**

---

## Troubleshooting

### Common Issues

| Issue                      | Solution                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| Containers fail to start   | Run `docker compose --env-file .env.docker.dev up --build`       |
| Database connection errors | Verify `.env` files have correct database credentials            |
| Prisma errors              | Delete `generated/` folder and restart containers                |
| Port already in use        | Change ports in `docker-compose.yml` or stop conflicting service |

### Docker Volume Issues

If experiencing database persistence problems:

```bash
# List all volumes
docker volume ls

# Inspect specific volume
docker volume inspect blabla-book_blablabook-db-volume

# Remove specific volume (all data will be lost)
docker volume rm blabla-book_blablabook-db-volume
```

### Accessing Services

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Adminer (Database UI)**: `http://localhost:8080`
  - Server: `blablabook-db`
  - Username: (from `.env` file)
  - Password: (from `.env` file)
  - Database: (from `.env` file)

---

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
