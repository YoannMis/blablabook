# Production Dockerfile for Render deployment
# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Copy source files
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate --schema=./prisma/schema.prisma

# Build TypeScript
RUN pnpm build

# Stage 2: Production stage
FROM node:24-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy built files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Run database migrations
RUN pnpm prisma:migrate:deploy

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV REFRESH_TOKEN_EXPIRES_IN=${REFRESH_TOKEN_EXPIRES_IN}
ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV GOOGLE_BOOKS_API_BASE_URL={GOOGLE_BOOKS_API_BASE_URL}
ENV GOOGLE_BOOKS_API_KEY=${GOOGLE_BOOKS_API_KEY}

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "./dist/index.js"]