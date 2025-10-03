#!/bin/sh

# Exit on error
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Running seed script..."
npm run seed:prod
echo "Database seeded successfully!"

echo "Starting application..."
exec npm run start:prod
