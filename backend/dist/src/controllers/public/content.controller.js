"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstructorContent = exports.getLatestMkStudioVideo = exports.getMkStudioPosts = exports.getNgoPosts = exports.getTermsOfServiceContent = exports.getPrivacyPolicyContent = exports.getAboutContent = exports.getHeroContent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get hero content
const getHeroContent = async (req, res) => {
    try {
        const [tagline, imageUrl, headline, description, youtube, instagram, twitter, linkedin, logoUrl,] = await Promise.all([
            prisma.siteContent.findUnique({ where: { key: 'hero_tagline' } }),
            prisma.siteContent.findUnique({ where: { key: 'hero_image_url' } }),
            prisma.siteContent.findUnique({ where: { key: 'hero_headline' } }),
            prisma.siteContent.findUnique({ where: { key: 'hero_description' } }),
            prisma.siteContent.findUnique({ where: { key: 'social_youtube' } }),
            prisma.siteContent.findUnique({ where: { key: 'social_instagram' } }),
            prisma.siteContent.findUnique({ where: { key: 'social_twitter' } }),
            prisma.siteContent.findUnique({ where: { key: 'social_linkedin' } }),
            prisma.siteContent.findUnique({ where: { key: 'navbar_logo_url' } }),
        ]);
        console.log('Retrieved hero content from DB:', {
            tagline: tagline === null || tagline === void 0 ? void 0 : tagline.value,
            imageUrl: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value,
            headline: headline === null || headline === void 0 ? void 0 : headline.value,
            description: description === null || description === void 0 ? void 0 : description.value,
        });
        // Log the full imageUrl object for debugging
        console.log('Full imageUrl object:', imageUrl);
        res.json({
            tagline: (tagline === null || tagline === void 0 ? void 0 : tagline.value) || 'Discover Amazing Opportunities',
            imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value) || 'https://placehold.co/1200x400',
            headline: (headline === null || headline === void 0 ? void 0 : headline.value) || '',
            description: (description === null || description === void 0 ? void 0 : description.value) || '',
            logoUrl: (logoUrl === null || logoUrl === void 0 ? void 0 : logoUrl.value) || '',
            socialLinks: {
                youtube: (youtube === null || youtube === void 0 ? void 0 : youtube.value) || '',
                instagram: (instagram === null || instagram === void 0 ? void 0 : instagram.value) || '',
                twitter: (twitter === null || twitter === void 0 ? void 0 : twitter.value) || '',
                linkedin: (linkedin === null || linkedin === void 0 ? void 0 : linkedin.value) || '',
            },
        });
    }
    catch (error) {
        console.error('Get hero content error:', error);
        res.status(500).json({ message: 'Error retrieving hero content' });
    }
};
exports.getHeroContent = getHeroContent;
// Get about content
const getAboutContent = async (req, res) => {
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
            teamMembers = (teamMembersData === null || teamMembersData === void 0 ? void 0 : teamMembersData.value)
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
        }
        catch (e) {
            teamMembers = [];
        }
        res.json({
            data: {
                html: (aboutHtml === null || aboutHtml === void 0 ? void 0 : aboutHtml.value) || '<p>Welcome to our platform</p>',
                teamMembers: teamMembers,
            },
        });
    }
    catch (error) {
        console.error('Get about content error:', error);
        res.status(500).json({ message: 'Error retrieving about content' });
    }
};
exports.getAboutContent = getAboutContent;
// Get privacy policy content
const getPrivacyPolicyContent = async (req, res) => {
    try {
        // Get privacy policy HTML content
        const privacyPolicyHtml = await prisma.siteContent.findUnique({
            where: { key: 'privacy_policy' },
        });
        res.json({
            content: (privacyPolicyHtml === null || privacyPolicyHtml === void 0 ? void 0 : privacyPolicyHtml.value) ||
                '<p>No privacy policy content available.</p>',
        });
    }
    catch (error) {
        console.error('Get privacy policy content error:', error);
        res
            .status(500)
            .json({ message: 'Error retrieving privacy policy content' });
    }
};
exports.getPrivacyPolicyContent = getPrivacyPolicyContent;
// Get terms of service content
const getTermsOfServiceContent = async (req, res) => {
    try {
        // Get terms of service HTML content
        const termsOfServiceHtml = await prisma.siteContent.findUnique({
            where: { key: 'terms_of_service' },
        });
        res.json({
            content: (termsOfServiceHtml === null || termsOfServiceHtml === void 0 ? void 0 : termsOfServiceHtml.value) ||
                '<p>No terms of service content available.</p>',
        });
    }
    catch (error) {
        console.error('Get terms of service content error:', error);
        res
            .status(500)
            .json({ message: 'Error retrieving terms of service content' });
    }
};
exports.getTermsOfServiceContent = getTermsOfServiceContent;
// Get NGO posts
const getNgoPosts = async (req, res) => {
    try {
        const posts = await prisma.ngoPost.findMany({
            orderBy: { postedAt: 'desc' },
            take: 10, // Limit to 10 most recent posts
        });
        res.json({
            data: posts,
        });
    }
    catch (error) {
        console.error('Get NGO posts error:', error);
        res.status(500).json({ message: 'Error retrieving NGO posts' });
    }
};
exports.getNgoPosts = getNgoPosts;
// Get MK Studio posts
const getMkStudioPosts = async (req, res) => {
    try {
        const posts = await prisma.mkStudioPost.findMany({
            orderBy: { publishedAt: 'desc' },
            take: 10, // Limit to 10 most recent posts
        });
        res.json({
            data: posts,
        });
    }
    catch (error) {
        console.error('Get MK Studio posts error:', error);
        res.status(500).json({ message: 'Error retrieving MK Studio posts' });
    }
};
exports.getMkStudioPosts = getMkStudioPosts;
// Get latest MK Studio video
const getLatestMkStudioVideo = async (req, res) => {
    try {
        const video = await prisma.mkStudioPost.findFirst({
            orderBy: { publishedAt: 'desc' },
        });
        if (!video) {
            return res.status(404).json({ message: 'No MK Studio videos found' });
        }
        const [channelName, channelTagline, subscribeUrl, channelImage] = await Promise.all([
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
                name: (channelName === null || channelName === void 0 ? void 0 : channelName.value) || 'MK Studio',
                tagline: (channelTagline === null || channelTagline === void 0 ? void 0 : channelTagline.value) || 'Official Channel',
                subscribeUrl: (subscribeUrl === null || subscribeUrl === void 0 ? void 0 : subscribeUrl.value) || 'https://www.youtube.com/@MKStudio',
                imageUrl: (channelImage === null || channelImage === void 0 ? void 0 : channelImage.value) || '',
            },
        });
    }
    catch (error) {
        console.error('Get latest MK Studio video error:', error);
        res
            .status(500)
            .json({ message: 'Error retrieving latest MK Studio video' });
    }
};
exports.getLatestMkStudioVideo = getLatestMkStudioVideo;
// Get instructor content
const getInstructorContent = async (req, res) => {
    try {
        const [name, title, bio, imageUrl, linkedin, twitter, instagram, companyLogos,] = await Promise.all([
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
            name: (name === null || name === void 0 ? void 0 : name.value) || 'Akshay Hangaragi',
            title: (title === null || title === void 0 ? void 0 : title.value) || 'Founder & Instructor',
            bio: (bio === null || bio === void 0 ? void 0 : bio.value) ||
                'Passionate about teaching and helping students crack their dream interviews.',
            imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value) || '',
            socialLinks: {
                linkedin: (linkedin === null || linkedin === void 0 ? void 0 : linkedin.value) || '',
                twitter: (twitter === null || twitter === void 0 ? void 0 : twitter.value) || '',
                instagram: (instagram === null || instagram === void 0 ? void 0 : instagram.value) || '',
            },
            companyLogos: (companyLogos === null || companyLogos === void 0 ? void 0 : companyLogos.value) ? JSON.parse(companyLogos.value) : [],
        });
    }
    catch (error) {
        console.error('Get instructor content error:', error);
        res.status(500).json({ message: 'Error retrieving instructor content' });
    }
};
exports.getInstructorContent = getInstructorContent;
