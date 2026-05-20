# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

ARG FRONTEND_LOCAL_PORT
ARG CORS_ORIGIN
ARG DATABASE_URL
ENV FRONTEND_LOCAL_PORT=$FRONTEND_LOCAL_PORT
ENV CORS_ORIGIN=$CORS_ORIGIN
ENV DATABASE_URL=$DATABASE_URL

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
RUN pnpm audit --fix=override

# Copy source files
COPY . .

# Build TypeScript
RUN pnpm build

# Stage 2: Production stage
FROM node:24-alpine

WORKDIR /app

# Install netcat-openbsd
RUN apk add --no-cache netcat-openbsd

# Install pnpm globally
RUN npm install -g pnpm

# Copy built files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 3003

# Use entrypoint
ENTRYPOINT ["/entrypoint.sh"]
