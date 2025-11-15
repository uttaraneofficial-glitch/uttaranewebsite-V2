import { PrismaClient, Company } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPassword = await bcrypt.hash(adminPasswordRaw, 10);
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });
  
  let admin: any;
  if (!existingAdmin) {
    admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('Created admin user:', admin);
  } else {
    console.log('Admin user already exists:', existingAdmin.username);
    admin = existingAdmin;
  }

  // Create sample companies (alphabetical order)
  const companyNames = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Tech Mahindra'];
  const companies: Company[] = [];
  
  for (let i = 0; i < companyNames.length; i++) {
    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyNames[i] },
    });
    
    if (!existingCompany) {
      const company = await prisma.company.create({
        data: {
          name: companyNames[i],
          slug: companyNames[i].toLowerCase().replace(/\s+/g, '-'),
          shortBio: `Leading ${companyNames[i]} company`,
          orderIndex: i,
          thumbnail: 'https://example.com/company-thumbnail.jpg',
        },
      });
      companies.push(company);
    } else {
      companies.push(existingCompany);
    }
  }

  console.log('Companies:', companies);

  // Create sample videos for each company (if they don't already exist)
  for (const company of companies) {
    // Check if video already exists for this company
    const existingVideo = await prisma.video.findFirst({
      where: {
        companyId: company.id,
        title: {
          contains: company.name,
        },
      },
    });
    
    if (!existingVideo) {
      await prisma.video.create({
        data: {
          companyId: company.id,
          title: `${company.name} Introduction`,
          youtubeId: 'dQw4w9WgXcQ', // Placeholder YouTube ID
          roundType: 'Technical',
          publishedAt: new Date(),
          thumbnail: 'https://example.com/video-thumbnail.jpg',
        },
      });
    }
  }

  // Create sample candidates for each company (if they don't already exist)
  for (const company of companies) {
    // Check if candidate already exists for this company
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        companyId: company.id,
        name: {
          contains: company.name.split(' ')[0],
        },
      },
    });
    
    if (!existingCandidate) {
      await prisma.candidate.create({
        data: {
          companyId: company.id,
          name: `${company.name.split(' ')[0]} Candidate`,
          college: 'Top University',
          branch: 'Computer Science',
          graduationYear: 2024,
          roleOffered: 'Software Engineer',
          packageOffered: '$100,000',
          profileImageUrl: 'https://example.com/profile.jpg',
          quote: 'Excited to join this amazing company!',
          linkedinUrl: 'https://linkedin.com/in/candidate',
        },
      });
    }
  }

  // Create sample NGO posts (if they don't already exist)
  const existingNgoPost = await prisma.ngoPost.findFirst();
  if (!existingNgoPost) {
    await prisma.ngoPost.create({
      data: {
        imageUrl: 'https://example.com/ngo-post1.jpg',
        caption: 'Helping communities in need',
        postedAt: new Date(),
      },
    });

    await prisma.ngoPost.create({
      data: {
        imageUrl: 'https://example.com/ngo-post2.jpg',
        caption: 'Supporting education initiatives',
        postedAt: new Date(),
      },
    });
  }

  // Create sample MK Studio posts (if they don't already exist)
  const existingMkStudioPost = await prisma.mkStudioPost.findFirst();
  if (!existingMkStudioPost) {
    await prisma.mkStudioPost.create({
      data: {
        youtubeId: 'dQw4w9WgXcQ',
        title: 'Latest MK Studio Video',
        description: 'Check out our latest video content',
        publishedAt: new Date(),
        thumbnail: 'https://example.com/mkstudio-thumbnail.jpg',
      },
    });
  }

  // Create site content (if it doesn't already exist)
  const existingHeroTagline = await prisma.siteContent.findUnique({
    where: { key: 'hero_tagline' },
  });
  
  if (!existingHeroTagline) {
    await prisma.siteContent.create({
      data: {
        key: 'hero_tagline',
        value: 'Discover Amazing Opportunities',
      },
    });
  }

  const existingHeroImageUrl = await prisma.siteContent.findUnique({
    where: { key: 'hero_image_url' },
  });
  
  if (!existingHeroImageUrl) {
    await prisma.siteContent.create({
      data: {
        key: 'hero_image_url',
        value: 'https://example.com/hero-image.jpg',
      },
    });
  }

  const existingHeroHeadline = await prisma.siteContent.findUnique({
    where: { key: 'hero_headline' },
  });
  
  if (!existingHeroHeadline) {
    await prisma.siteContent.create({
      data: {
        key: 'hero_headline',
        value: 'Welcome to Our Platform',
      },
    });
  }

  const existingHeroDescription = await prisma.siteContent.findUnique({
    where: { key: 'hero_description' },
  });
  
  if (!existingHeroDescription) {
    await prisma.siteContent.create({
      data: {
        key: 'hero_description',
        value: 'Discover amazing content and connect with top companies',
      },
    });
  }

  const existingAboutHtml = await prisma.siteContent.findUnique({
    where: { key: 'about_html' },
  });
  
  if (!existingAboutHtml) {
    await prisma.siteContent.create({
      data: {
        key: 'about_html',
        value: '<p>Welcome to our platform. We connect talented individuals with amazing companies.</p>',
      },
    });
  }

  const existingTeamMembers = await prisma.siteContent.findUnique({
    where: { key: 'team_members' },
  });
  
  if (!existingTeamMembers) {
    const defaultTeamMembers = [
      {
        id: '1',
        name: 'John Doe',
        role: 'CEO & Founder',
        imageUrl: '',
        linkedinUrl: ''
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'CTO',
        imageUrl: '',
        linkedinUrl: ''
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Head of Operations',
        imageUrl: '',
        linkedinUrl: ''
      }
    ];
    
    await prisma.siteContent.create({
      data: {
        key: 'team_members',
        value: JSON.stringify(defaultTeamMembers),
      },
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });