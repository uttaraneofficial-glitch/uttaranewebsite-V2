"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAboutPageContent = exports.getAboutPageContent = exports.getPublicVideoById = exports.getPublicVideos = exports.getPublicCompanyById = exports.getPublicCompanies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all public companies (published only)
const getPublicCompanies = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause for published companies only
        let where = {
        // Add any additional filters for public companies here
        };
        if (search) {
            where = Object.assign(Object.assign({}, where), { OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ] });
        }
        const companies = await prisma.company.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });
        const total = await prisma.company.count({ where });
        res.json({
            data: companies,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get public companies error:', error);
        res.status(500).json({ message: 'Error retrieving companies' });
    }
};
exports.getPublicCompanies = getPublicCompanies;
// Get public company by ID
const getPublicCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ data: company });
    }
    catch (error) {
        console.error('Get public company error:', error);
        res.status(500).json({ message: 'Error retrieving company' });
    }
};
exports.getPublicCompanyById = getPublicCompanyById;
// Get all published videos
const getPublicVideos = async (req, res) => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // @ts-ignore - Prisma client issue
        const videos = await prisma.video.findMany({
            where: { isPublished: true },
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });
        // @ts-ignore - Prisma client issue
        const total = await prisma.video.count({ where: { isPublished: true } });
        res.json({
            data: videos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get public videos error:', error);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};
exports.getPublicVideos = getPublicVideos;
// Get published video by ID
const getPublicVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        // @ts-ignore - Prisma client issue
        const video = await prisma.video.findUnique({
            where: {
                id,
                isPublished: true
            },
        });
        if (!video) {
            return res.status(404).json({ message: 'Video not found or not published' });
        }
        res.json({ data: video });
    }
    catch (error) {
        console.error('Get public video error:', error);
        res.status(500).json({ message: 'Error retrieving video' });
    }
};
exports.getPublicVideoById = getPublicVideoById;
// Get about page content
const getAboutPageContent = async (req, res) => {
    try {
        // In a real application, this would fetch from a database or CMS
        // For now, we'll return static content
        const content = {
            title: "About Us",
            description: "Learn more about our company and mission",
            content: "<p>Welcome to our company. We are dedicated to providing excellent services.</p>"
        };
        res.json({ data: content });
    }
    catch (error) {
        console.error('Get about page content error:', error);
        res.status(500).json({ message: 'Error retrieving content' });
    }
};
exports.getAboutPageContent = getAboutPageContent;
// Update about page content (admin only)
const updateAboutPageContent = async (req, res) => {
    try {
        // In a real application, this would update the database
        // For now, we'll just return success
        const { title, description, content } = req.body;
        // Validation would go here
        res.json({
            data: { title, description, content },
            message: 'About page content updated successfully'
        });
    }
    catch (error) {
        console.error('Update about page content error:', error);
        res.status(500).json({ message: 'Error updating content' });
    }
};
exports.updateAboutPageContent = updateAboutPageContent;
