"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyVideosBySlug = exports.getPublicCompanyBySlug = exports.getPublicCompanies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all public companies (alphabetical order)
const getPublicCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            include: {
                candidates: true, // Include candidates in response
            },
            orderBy: { name: 'asc' },
        });
        res.json({
            data: companies,
        });
    }
    catch (error) {
        console.error('Get public companies error:', error);
        res.status(500).json({ message: 'Error retrieving companies' });
    }
};
exports.getPublicCompanies = getPublicCompanies;
// Get public company by slug (case-insensitive)
const getPublicCompanyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        // Find company with case-insensitive slug matching
        const company = await prisma.company.findFirst({
            where: {
                slug: {
                    mode: 'insensitive',
                    equals: slug,
                },
            },
            include: {
                candidates: true, // Include candidates in response
            },
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
exports.getPublicCompanyBySlug = getPublicCompanyBySlug;
// Get videos for a company by slug (case-insensitive)
const getCompanyVideosBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { roundType } = req.query;
        // First, find the company by slug (case-insensitive)
        const company = await prisma.company.findFirst({
            where: {
                slug: {
                    mode: 'insensitive',
                    equals: slug,
                },
            },
        });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        // Then get videos for that company with candidate information
        const where = {
            companyId: company.id,
            publishedAt: {
                not: null,
            },
        };
        // Add roundType filter if provided
        if (roundType && typeof roundType === 'string') {
            where.roundType = roundType;
        }
        const videos = await prisma.video.findMany({
            where,
            include: {
                candidate: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
        });
        res.json({
            data: videos,
        });
    }
    catch (error) {
        console.error('Get company videos error:', error);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};
exports.getCompanyVideosBySlug = getCompanyVideosBySlug;
