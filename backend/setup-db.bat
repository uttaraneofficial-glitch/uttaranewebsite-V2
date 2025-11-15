@echo off
echo Setting up the database...

REM Run database setup script
npx ts-node src/config/database.ts

REM Run Prisma migrations
npx prisma migrate dev --name init

REM Generate Prisma client
npx prisma generate

echo Database setup completed!