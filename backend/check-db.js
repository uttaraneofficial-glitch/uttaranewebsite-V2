const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Try a simple query
    const companies = await prisma.company.findMany({ take: 1 });
    console.log('✅ Database query successful');
    console.log('Sample companies:', companies);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();