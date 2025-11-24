const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkHeroContent() {
  try {
    console.log('🔍 Checking hero content in database...\n');
    
    // Get hero image URL from database
    const heroImageUrl = await prisma.siteContent.findUnique({
      where: { key: 'hero_image_url' },
    });
    
    if (heroImageUrl) {
      console.log('📄 Hero Image URL from database:');
      console.log('Key:', heroImageUrl.key);
      console.log('Value:', heroImageUrl.value);
      console.log('Value length:', heroImageUrl.value?.length);
      console.log('Starts with "data:image":', heroImageUrl.value?.startsWith('data:image'));
      console.log('Starts with "\\"data:image":', heroImageUrl.value?.startsWith('"data:image'));
      console.log('Ends with "\\":', heroImageUrl.value?.endsWith('"'));
      console.log('');
      
      // Check if it has extra quotes
      if (heroImageUrl.value?.startsWith('"') && heroImageUrl.value?.endsWith('"')) {
        console.log('❌ ISSUE DETECTED: Value has extra quotes at beginning and end');
        console.log('Raw value:', JSON.stringify(heroImageUrl.value));
      } else {
        console.log('✅ Value appears to be correctly formatted');
      }
    } else {
      console.log('❌ No hero image URL found in database');
    }
    
    // Also check other hero content
    const heroTagline = await prisma.siteContent.findUnique({
      where: { key: 'hero_tagline' },
    });
    
    const heroHeadline = await prisma.siteContent.findUnique({
      where: { key: 'hero_headline' },
    });
    
    const heroDescription = await prisma.siteContent.findUnique({
      where: { key: 'hero_description' },
    });
    
    console.log('\n📄 Other hero content:');
    console.log('Tagline:', heroTagline?.value || 'Not set');
    console.log('Headline:', heroHeadline?.value || 'Not set');
    console.log('Description:', heroDescription?.value || 'Not set');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkHeroContent();