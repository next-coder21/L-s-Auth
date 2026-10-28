#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping 1s"
  sleep 1
done
echo "PostgreSQL is reachable!"

echo "Deploying database migrations..."
pnpm --filter @ls-auth/database run deploy

echo "Seeding initial identity records..."
pnpm --filter @ls-auth/database run seed || true

echo "Starting NestJS Management API..."
exec pnpm --filter @ls-auth/api run start:prod
