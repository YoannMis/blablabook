# BlablaBook – Frontend

> **A Personal Library Management & Book Discovery Platform**

BlablaBook is a modern web application designed to help users manage their personal book collections and discover new reads. It provides a simple, intuitive interface for tracking reading progress, searching for books, and accessing detailed information about literary works.

The platform also features a **community dimension**, enabling users to share their reading lists, recommendations, and book reviews with friends and fellow bibliophiles.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Personal Library Management**: Organize, track, and catalog your book collection
- **Reading Progress Tracking**: Monitor your reading history and current reads
- **Book Search & Discovery**: Find new books with powerful search capabilities
- **Detailed Book Information**: Access comprehensive metadata, synopses, and reviews

---

## Technologies

| Area                 | Technologies               |
| -------------------- | -------------------------- |
| **Frontend**         | React, TypeScript, Vite    |
| **State Management** | React (Context API, Hooks) |
| **Styling**          | Chakra UI,                 |
| **Backend**          | Express.js, Node.js        |
| **Database**         | PostgreSQL, Prisma ORM     |
| **Package Manager**  | [pnpm](https://pnpm.io/)   |
| **Containerization** | Docker, Docker Compose     |

---

## Installation

> **Note**: While Docker is recommended for a clean and consistent development environment (see [INSTALL.md](./INSTALL.md)), you can also set up the project manually as described below.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (required package manager)
- [PostgreSQL](https://www.postgresql.org/) (v18 or later) – for local database

### Setup

#### 1. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Frontend
pnpm --dir ./front install

# Backend
pnpm --dir ./back install
```

#### 2. Configure Environment Variables

Copy the example environment files and update them with your local settings:

```bash
# Frontend
cp ./front/.env.example ./front/.env
# Edit .env with your configuration

# Backend
cp ./back/.env.example ./back/.env
# Edit .env with your database connection and API settings
```

#### 3. Database Setup (Prisma)

From the backend directory, generate the Prisma client and apply the database schema:

```bash
cd back

# Generate Prisma client
pnpm prisma:generate

# Push schema to database (for development)
pnpm prisma:push
```

> **Note**: For production or team environments, use `pnpm prisma:migrate:dev` to create and apply migrations.

#### 4. Optional: Seed the Database

To populate your database with sample data:

```bash
pnpm prisma:seed
```

### Run Development Servers

Open two separate terminal windows:

**Terminal 1 – Backend:**

```bash
cd back
pnpm dev
```

Server runs at `http://localhost:3000`

**Terminal 2 – Frontend:**

```bash
cd front
pnpm dev
```

Server runs at `http://localhost:5173`

The frontend will automatically connect to the backend API.

---

## Development

### Full Environment Setup

For complete development environment setup including backend, database, and Docker configuration, refer to the detailed installation guide:

> [📖 **INSTALL.md**](./INSTALL.md)

This document covers:

- Docker-based development environment
- Database configuration with PostgreSQL
- Prisma migrations and schema management
- Database seeding with sample data
- Default development user accounts

---

## Project Structure

```
blabla-book/
├── front/                  # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS and Tailwind configurations
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── back/                   # Backend application
├── docker-compose.yml      # Docker configuration
└── INSTALL.md              # Installation guide
```

---

## License

This project is private and proprietary. All rights reserved.

---

_Built with passion for book lovers everywhere_
