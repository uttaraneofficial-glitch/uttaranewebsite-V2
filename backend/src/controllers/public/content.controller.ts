import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get hero content
// Get hero content
export const getHeroContent = async (req: Request, res: Response) => {
  try {
    const [
      headline,
      tagline,
      description,
      imageUrl,
      youtube,
      instagram,
      twitter,
      linkedin,
      siteLogo, // Add this
    ] = await Promise.all([
      prisma.siteContent.findUnique({ where: { key: 'hero_headline' } }),
      prisma.siteContent.findUnique({ where: { key: 'hero_tagline' } }),
      prisma.siteContent.findUnique({ where: { key: 'hero_description' } }),
      prisma.siteContent.findUnique({ where: { key: 'hero_image_url' } }),
      prisma.siteContent.findUnique({ where: { key: 'social_youtube' } }),
      prisma.siteContent.findUnique({ where: { key: 'social_instagram' } }),
      prisma.siteContent.findUnique({ where: { key: 'social_twitter' } }),
      prisma.siteContent.findUnique({ where: { key: 'social_linkedin' } }),
      prisma.siteContent.findUnique({ where: { key: 'navbar_logo_url' } }), // Add this
    ]);

    res.json({
      headline: headline?.value || '',
      tagline: tagline?.value || '',
      description: description?.value || '',
      imageUrl: imageUrl?.value || '',
      logoUrl: siteLogo?.value || '', // Use the destructured variable
      socialLinks: {
        youtube: youtube?.value || '',
        instagram: instagram?.value || '',
        twitter: twitter?.value || '',
        linkedin: linkedin?.value || '',
      },
    });
  } catch (error: any) {
    console.error("❌ Hero API error:", error);
    return res.status(500).json({
      message: "Error retrieving hero content",
      error: error.message
    });
  }
};

// Get about content
export const getAboutContent = async (req: Request, res: Response) => {
  try {
    // Get about HTML content
    const aboutHtml = await prisma.siteContent.findUnique({
      where: { key: 'about_html' },
    });

    // Get team members data
    const teamMembersData = await prisma.siteContent.findUnique({
      where: { key: 'team_members' },
    });

    // Parse team members JSON or use default
    let teamMembers = [];
    try {
      teamMembers = teamMembersData?.value
        ? JSON.parse(teamMembersData.value)
        : [
          {
            id: '1',
            name: 'John Doe',
            role: 'CEO & Founder',
            imageUrl: '',
            linkedinUrl: '',
          },
          {
            id: '2',
            name: 'Jane Smith',
            role: 'CTO',
            imageUrl: '',
            linkedinUrl: '',
          },
          {
            id: '3',
            name: 'Mike Johnson',
            role: 'Head of Operations',
            imageUrl: '',
            linkedinUrl: '',
          },
        ];
    } catch (e) {
      teamMembers = [];
    }

    res.json({
      data: {
        html: aboutHtml?.value || '<p>Welcome to our platform</p>',
        teamMembers: teamMembers,
      },
    });
  } catch (error) {
    console.error('Get about content error:', error);
    res.status(500).json({ message: 'Error retrieving about content' });
  }
};

// Get privacy policy content
export const getPrivacyPolicyContent = async (req: Request, res: Response) => {
  try {
    // Get privacy policy HTML content
    const privacyPolicyHtml = await prisma.siteContent.findUnique({
      where: { key: 'privacy_policy' },
    });

    res.json({
      content:
        privacyPolicyHtml?.value ||
        '<p>No privacy policy content available.</p>',
    });
  } catch (error) {
    console.error('Get privacy policy content error:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving privacy policy content' });
  }
};

// Get terms of service content
export const getTermsOfServiceContent = async (req: Request, res: Response) => {
  try {
    // Get terms of service HTML content
    const termsOfServiceHtml = await prisma.siteContent.findUnique({
      where: { key: 'terms_of_service' },
    });

    res.json({
      content:
        termsOfServiceHtml?.value ||
        '<p>No terms of service content available.</p>',
    });
  } catch (error) {
    console.error('Get terms of service content error:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving terms of service content' });
  }
};

// Get NGO posts
export const getNgoPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.ngoPost.findMany({
      orderBy: { postedAt: 'desc' },
      take: 10, // Limit to 10 most recent posts
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.error('Get NGO posts error:', error);
    res.status(500).json({ message: 'Error retrieving NGO posts' });
  }
};

// Get MK Studio posts
export const getMkStudioPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.mkStudioPost.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 10, // Limit to 10 most recent posts
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.error('Get MK Studio posts error:', error);
    res.status(500).json({ message: 'Error retrieving MK Studio posts' });
  }
};

// Get latest MK Studio video
export const getLatestMkStudioVideo = async (req: Request, res: Response) => {
  try {
    const video = await prisma.mkStudioPost.findFirst({
      orderBy: { publishedAt: 'desc' },
    });

    if (!video) {
      return res.status(404).json({ message: 'No MK Studio videos found' });
    }

    const [channelName, channelTagline, subscribeUrl, channelImage] =
      await Promise.all([
        prisma.siteContent.findUnique({
          where: { key: 'mkstudio_channel_name' },
        }),
        prisma.siteContent.findUnique({
          where: { key: 'mkstudio_channel_tagline' },
        }),
        prisma.siteContent.findUnique({
          where: { key: 'mkstudio_subscribe_url' },
        }),
        prisma.siteContent.findUnique({
          where: { key: 'mkstudio_channel_image' },
        }),
      ]);

    res.json({
      data: video,
      channel: {
        name: channelName?.value || 'MK Studio',
        tagline: channelTagline?.value || 'Official Channel',
        subscribeUrl:
          subscribeUrl?.value || 'https://www.youtube.com/@MKStudio',
        imageUrl: channelImage?.value || '',
      },
    });
  } catch (error) {
    console.error('Get latest MK Studio video error:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving latest MK Studio video' });
  }
};

// Get instructor content
export const getInstructorContent = async (req: Request, res: Response) => {
  try {
    const [
      name,
      title,
      bio,
      imageUrl,
      linkedin,
      twitter,
      instagram,
      companyLogos,
    ] = await Promise.all([
      prisma.siteContent.findUnique({ where: { key: 'instructor_name' } }),
      prisma.siteContent.findUnique({ where: { key: 'instructor_title' } }),
      prisma.siteContent.findUnique({ where: { key: 'instructor_bio' } }),
      prisma.siteContent.findUnique({ where: { key: 'instructor_image_url' } }),
      prisma.siteContent.findUnique({
        where: { key: 'instructor_social_linkedin' },
      }),
      prisma.siteContent.findUnique({
        where: { key: 'instructor_social_twitter' },
      }),
      prisma.siteContent.findUnique({
        where: { key: 'instructor_social_instagram' },
      }),
      prisma.siteContent.findUnique({
        where: { key: 'instructor_company_logos' },
      }),
    ]);

    res.json({
      name: name?.value || 'Akshay Hangaragi',
      title: title?.value || 'Founder & Instructor',
      bio:
        bio?.value ||
        'Passionate about teaching and helping students crack their dream interviews.',
      imageUrl: imageUrl?.value || '',
      socialLinks: {
        linkedin: linkedin?.value || '',
        twitter: twitter?.value || '',
        instagram: instagram?.value || '',
      },
      companyLogos: companyLogos?.value ? JSON.parse(companyLogos.value) : [],
    });
  } catch (error) {
    console.error('Get instructor content error:', error);
    res.status(500).json({ message: 'Error retrieving instructor content' });
  }
};
