"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        // Test the database connection
        await prisma.$connect();
        console.log('Successfully connected to the database');
        // Create database tables
        await prisma.$executeRaw `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        console.log('Database setup completed successfully');
    }
    catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
