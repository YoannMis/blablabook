# Wait for Postgres to be ready (open port)
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z blablabook-db 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Generate Prisma schema
pnpm exec prisma generate --schema=./prisma/schema.prisma

# Verify if any migrations exist
if [ ! -d "/app/prisma/migrations" ] || [ -z "$(ls -A /app/prisma/migrations)" ]; then
  echo "No migrations found. Creating initial migration..."
  pnpm prisma:migrate:init
fi

# Apply migrations and start the app
echo "Applying migrations... And starting the application..."
pnpm docker:prod