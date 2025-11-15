"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestMkStudioVideo = exports.getMkStudioPosts = exports.getNgoPosts = exports.getHeroContent = exports.getAboutContent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get about page content
const getAboutContent = async (req, res) => {
    try {
        const content = await prisma.siteContent.findUnique({
            where: { key: 'about_html' },
        });
        res.json({
            data: content || { key: 'about_html', value: '' },
        });
    }
    catch (error) {
        console.error('Get about content error:', error);
        res.status(500).json({ message: 'Error retrieving content' });
    }
};
exports.getAboutContent = getAboutContent;
// Get hero content
const getHeroContent = async (req, res) => {
    try {
        const tagline = await prisma.siteContent.findUnique({
            where: { key: 'hero_tagline' },
        });
        const imageUrl = await prisma.siteContent.findUnique({
            where: { key: 'hero_image_url' },
        });
        res.json({
            data: {
                tagline: tagline || { key: 'hero_tagline', value: '' },
                imageUrl: imageUrl || { key: 'hero_image_url', value: '' },
            },
        });
    }
    catch (error) {
        console.error('Get hero content error:', error);
        res.status(500).json({ message: 'Error retrieving content' });
    }
};
exports.getHeroContent = getHeroContent;
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
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};
exports.getNgoPosts = getNgoPosts;
// Get MK Studio posts
const getMkStudioPosts = async (req, res) => {
    try {
        const posts = await prisma.mkStudioPost.findMany({
            orderBy: { publishedAt: 'desc' },
            take: 5, // Limit to 5 most recent posts
        });
        res.json({
            data: posts,
        });
    }
    catch (error) {
        console.error('Get MK Studio posts error:', error);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};
exports.getMkStudioPosts = getMkStudioPosts;
// Get latest MK Studio video
const getLatestMkStudioVideo = async (req, res) => {
    try {
        const video = await prisma.mkStudioPost.findFirst({
            orderBy: { publishedAt: 'desc' },
        });
        res.json({
            data: video,
        });
    }
    catch (error) {
        console.error('Get latest MK Studio video error:', error);
        res.status(500).json({ message: 'Error retrieving video' });
    }
};
exports.getLatestMkStudioVideo = getLatestMkStudioVideo;
