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
    await prisma.siteContent.create({
      data: {
        key: 'team_members',
        value: JSON.stringify([
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
        ]),
      },
    });
  }

  // Create default privacy policy content if it doesn't exist
  const existingPrivacyPolicy = await prisma.siteContent.findUnique({
    where: { key: 'privacy_policy' },
  });
  
  if (!existingPrivacyPolicy) {
    await prisma.siteContent.create({
      data: {
        key: 'privacy_policy',
        value: `<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>

<h3>3. Information Sharing and Disclosure</h3>
<p>We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as described in this policy.</p>

<h3>4. Data Security</h3>
<p>We implement a variety of security measures to maintain the safety of your personal information.</p>

<h3>5. Your Rights</h3>
<p>You have the right to access, update, or delete your personal information at any time.</p>

<h3>6. Changes to This Policy</h3>
<p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

<h3>7. Contact Us</h3>
<p>If you have any questions about this privacy policy, please contact us at privacy@example.com.</p>`,
      },
    });
  }

  // Create default terms of service content if it doesn't exist
  const existingTermsOfService = await prisma.siteContent.findUnique({
    where: { key: 'terms_of_service' },
  });
  
  if (!existingTermsOfService) {
    await prisma.siteContent.create({
      data: {
        key: 'terms_of_service',
        value: `<h2>Terms of Service</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

<h3>2. Description of Service</h3>
<p>Our service provides a platform for connecting companies with talented individuals through interview content and resources.</p>

<h3>3. User Responsibilities</h3>
<p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>

<h3>4. Intellectual Property</h3>
<p>All content included as part of the service, such as text, graphics, logos, and software, is the property of our company.</p>

<h3>5. Limitation of Liability</h3>
<p>In no event shall our company be liable for any indirect, incidental, special, or consequential damages.</p>

<h3>6. Changes to Terms</h3>
<p>We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance.</p>

<h3>7. Governing Law</h3>
<p>These terms shall be governed by and construed in accordance with the laws of your jurisdiction.</p>

<h3>8. Contact Information</h3>
<p>If you have any questions about these Terms of Service, please contact us at terms@example.com.</p>`,
      },
    });
  }

  // Create default contact email if it doesn't exist
  const existingContactEmail = await prisma.siteContent.findUnique({
    where: { key: 'contact_email' },
  });
  
  if (!existingContactEmail) {
    await prisma.siteContent.create({
      data: {
        key: 'contact_email',
        value: 'akshaytech01@gmail.com',
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