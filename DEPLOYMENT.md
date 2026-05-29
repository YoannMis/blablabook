# BlablaBook - Docker Deployment Guide with Nginx and Certbot

This guide provides a **complete deployment procedure** for the BlablaBook application on an Ubuntu VPS using Docker, Nginx as a reverse proxy, and Certbot for Let's Encrypt SSL certificates.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Project Structure](#-project-structure)
3. [VPS Preparation](#-vps-preparation)
4. [Git and SSH Configuration](#-git-and-ssh-configuration)
5. [Repository Cloning](#-repository-cloning)
6. [Initial Configuration](#-initial-configuration)
7. [First Deployment (HTTP)](#-first-deployment-http)
8. [SSL Configuration with Certbot](#-ssl-configuration-with-certbot)
9. [Final Deployment (HTTPS)](#-final-deployment-https)

---

## 📦 Prerequisites

### On Your Local Machine

- Git installed
- SSH access to your VPS
- SSH key generator

### On the VPS

| Software | Recommended Version | Usage |
| -------------------------- | ---------------------------- | --------------------- |
| **Operating System** | Ubuntu 22.04 LTS / 24.04 LTS | or Debian 12+ |
| **Docker** | 24.x+ | Container runtime |
| **Git** | 2.x+ | Version control |
| **Certbot** | Latest version | SSL certificates |

### Minimum VPS Resources

| Resource | Production | Development |
| -------------- | ---------- | ------------- |
| CPU | 2 cores | 1 core |
| RAM | 4 GB | 2 GB |
| Storage | 50 GB SSD | 20 GB SSD |
| Bandwidth | 100 Mbps | 50 Mbps |

> ⚠️ **Important**: Ports **80** and **443** must be **available** on your VPS for HTTPS to work.

---

## 🏗️ Project Structure

```
blabla-book/
├── back/                          # Backend (Express + TypeScript + Prisma)
│   ├── src/                      # Source code
│   ├── prisma/                   # Prisma schema and migrations
│   │   └── migrations/           # Docker volume for migrations
│   ├── Dockerfile                # Production Dockerfile
│   └── entrypoint.sh             # Production entrypoint script
│
├── front/                         # Frontend (Vite + TypeScript)
│   ├── src/                      # Source code
│   ├── Dockerfile                # Dockerfile (based on Nginx)
│   └── nginx.conf                # Initial Nginx HTTP configuration
│
├── nginx/                         # Nginx configuration
│   ├── nginx-certbot.conf        # Certbot configuration (webroot)
│   └── nginx-https.conf          # Final HTTPS configuration
│
├── docker-compose.prod.yml       # Docker Compose production configuration
├── .env.docker.prod.example      # Docker environment variables template
└── backup-db.sh                  # Database backup script
```

---

## 🚀 VPS Preparation

### 1. SSH Connection

Connect to your VPS as root (only for initial configuration):

```bash
# Replace with your VPS IP
ssh root@your-vps-ip
```

### 2. Create a Non-Root User (Security)

Create a dedicated user for deployment:

```bash
# Create a new user (replace 'deploy' with your username)
sudo adduser deploy

# Add user to sudo group (optional, for admin commands)
sudo usermod -aG sudo deploy

# Switch to the new user
su - deploy

# Or reconnect directly
ssh deploy@your-vps-ip
```

> ✅ **Best practices**: Always work with a non-root user. Use `sudo` only when necessary.

### 3. System Update

> As `root` user or `deploy` user if added to `sudo` group.

```bash
# Update all packages
sudo apt update && sudo apt upgrade -y

# Reboot if necessary
sudo reboot
```

### 4. Install Basic Dependencies

> As `root` user or `deploy` user if added to `sudo` group.

```bash
# Install essential tools
sudo apt install -y curl wget git htop net-tools unzip build-essential
```

### 5. Install Docker Engine

> As `root` user or `deploy` user if added to `sudo` group.

Follow the official Docker documentation for Ubuntu 👉 [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

---

## 🔐 Git and SSH Configuration

> As `deploy` user.

### 1. Git Configuration

```bash
# Configure your Git name and email
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Configure default editor (optional)
git config --global core.editor nano
```

### 2. Create SSH Key for GitHub

GitHub Documentation 👉 [Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=linux)

```bash
# Generate a new SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# Display public key
cat ~/.ssh/id_ed25519.pub

# Copy key to clipboard (if available)
# On Linux:
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
```

### 3. Add SSH Key to GitHub

GitHub Documentation 👉 [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

1. Go to [GitHub → Settings → SSH and GPG keys](https://github.com/settings/keys)
2. Click on "New SSH key"
3. Give a title (e.g., "VPS BlablaBook")
4. Paste your public key
5. Click on "Add SSH key"

### 4. Test SSH Connection

```bash
# Test connection to GitHub
ssh -T git@github.com
# You should see: "Hi username! You've successfully authenticated..."
```

---

## 📥 Repository Cloning

> As `deploy` user.

```bash
# Navigate to user directory
cd ~/

# Clone the repository with SSH
git clone git@github.com:your-username/blabla-book.git .
```

---

## ⚙️ Nginx Configuration

### Update all Nginx files

⚠️ **Replace** `your-domain.com` with your actual domain name in:

- `/path/to/your/project/nginx/nginx-cerbot.conf`
- `/path/to/your/project/nginx/nginx-https.conf`
- `/path/to/your/project/front/nginx.conf`

---

## 🔧 Environment Variables Configuration

### 1. Configure `.env.docker.prod`

Copy the template and modify it:

```bash
# Copy example file
cp .env.docker.prod.example .env.docker.prod

# Edit the file
nano .env.docker.prod
```

**Required Variables:**

| Variable | Description | Example |
| --------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `POSTGRES_USER` | PostgreSQL user | `blablabook_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `secure_password_123!` |
| `POSTGRES_DB` | Database name | `blablabook_prod` |
| `PG_VERSION` | PostgreSQL version | `18` or higher |
| `NODE_ENV` | Node.js environment | `production` for production |
| `JWT_SECRET` | JWT secret (min 32 characters) | `your_secure_secret_32_chars!` |
| `JWT_EXPIRES_IN` | JWT validity duration | `1d` or `86400` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token duration | `7d` or `604800` |
| `DATABASE_URL` | Full PostgreSQL database URL | `"postgres://{POSTGRES_USER}:{POSTGRES_PASSWORD}@blablabook-db:5432/{POSTGRES_DB}"` |
| `BACKEND_LOCAL_PORT` | Backend port | `3003` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://your-domain.com` |
| `VITE_API_URL` | API URL for frontend | `/api` by default |
| `GOOGLE_BOOKS_API_BASE_URL` | Google Books API URL | `https://www.googleapis.com/books/v1/volumes` |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | `AIzaSyD...` |
| `HTTP_PORT` | HTTP port | `80` by default |
| `HTTPS_PORT` | HTTPS port | `443` by default |

> ⚠️ **Generate a secure JWT_SECRET:**
>
> ```bash
> openssl rand -base64 32
> ```

> ⚠️ **IMPORTANT**: `DATABASE_URL` **must use the Docker service name** (`blablabook-db`) as host, **not localhost** or `127.0.0.1`.

> ⚠️ For the first HTTP deployment, set the variable `NODE_ENV=dev` to avoid blocking http-only cookies.

### 2. Get a Google Books API Key

1. Create or have a Google account
2. Go to [Google Cloud Console](https://console.cloud.google.com/apis/)
3. Create a new project
4. Enable the **Google Books API**
5. Create credentials (API Key)
6. Optionally, restrict the key by IP or domain
7. Copy the key to your environment variables

---

## ▶️ First Deployment (HTTP)

### 1. Launch Containers

> As `deploy` user.

```bash
# Navigate to project directory
cd ~/project-name

# Build and launch containers
docker compose -f docker-compose.prod.yml --env-file .env.docker.prod up --build
```

### 2. Verify HTTP Functionality

- See all running containers in the console during build.
- Check logs for each service.
- Test HTTP access to the application in your browser.

> ✅ **Verify** that the application works correctly in HTTP before proceeding to SSL.

---

## 🔒 SSL Configuration with Certbot

### 1. Install Certbot

> As `root` user.

```bash
# Install Certbot
sudo snap install --classic certbot

# Create directory for certificates
sudo mkdir -p /path/to/your/project/certbot-webroot/.well-known/acme-challenge
sudo mkdir -p /path/to/your/project/nginx/ssl

# Grant necessary permissions
sudo chown -R $USER:$USER /path/to/your/project/certbot-webroot
sudo chown -R $USER:$USER /path/to/your/project/nginx
```

### 2. Launch Temporary Nginx Container for Certbot

```bash
# Stop Docker containers
docker compose -f docker-compose.prod.yml --env-file .env.docker.prod down

# Launch a temporary Nginx container for Certbot validation
docker run -d --name certbot-nginx \
  -p 80:80 \
  -v /path/to/your/project/certbot-webroot:/usr/share/nginx/html \
  -v /path/to/your/project/nginx/nginx-certbot.conf:/etc/nginx/conf.d/default.conf \
  nginx:alpine
```

### 3. Generate SSL Certificates with Certbot (webroot method)

```bash
# Generate certificates with webroot method
sudo certbot certonly --webroot \
  -w /path/to/your/project/certbot-webroot \
  -d your-domain.com \
  -d www.your-domain.com

# Verify certificates were generated
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

Output:

```bash
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/blablabook-from-francfort.cloud/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/blablabook-from-francfort.cloud/privkey.pem
This certificate expires on 2026-08-26.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.
```

> ⚠️ **If Certbot fails**: Check that your DNS points to your VPS IP with `dig your-domain.com`.

### 4. Copy Certificates to Nginx Directory

```bash
# Create destination directory
sudo mkdir -p /path/to/your/project/nginx/ssl/live/your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /path/to/your/project/nginx/ssl/live/your-domain.com/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /path/to/your/project/nginx/ssl/live/your-domain.com/

# Grant permissions to deploy user
sudo chown -R deploy:deploy /path/to/your/project/nginx/ssl
```

### 5. Configure Nginx HTTPS File

Edit the `nginx/nginx-https.conf` file you created earlier to ensure certificate paths are correct:

```nginx
# Verify paths are correct
ssl_certificate /etc/nginx/ssl/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/live/your-domain.com/privkey.pem;
```

### 6. Replace Nginx Configuration

Replace the `nginx.conf` file in the `front/` directory with the `nginx-https.conf` file:

```bash
cp /path/to/your/project/nginx/nginx-https.conf /path/to/your/project/front/nginx.conf
```

### 7. Remove Temporary Container and Rebuild

> As `deploy` user.

```bash
# Stop and remove temporary container
docker stop certbot-nginx
docker rm certbot-nginx
```

Update the `NODE_ENV` environment variable in the `.env.docker.prod` file:

```bash
# .env.docker.prod

NODE_ENV=production
```

```bash
# Rebuild and restart all containers
docker compose -f docker-compose.prod.yml --env-file .env.docker.prod up --build
```

### 8. Verify HTTPS Functionality

```bash
# Check all containers are running
docker ps -a

# Test HTTPS access
curl -k https://your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com | openssl x509 -noout -dates
```

Test the application online in your browser.

> ✅ **Verify** that HTTP → HTTPS redirection works correctly.
