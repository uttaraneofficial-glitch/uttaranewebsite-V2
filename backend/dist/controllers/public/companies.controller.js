"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyVideosBySlug = exports.getPublicCompanyBySlug = exports.getPublicCompanies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all public companies (alphabetical order)
const getPublicCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
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
// Get public company by slug
const getPublicCompanyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const company = await prisma.company.findFirst({
            where: { slug: slug },
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
// Get videos for a company by slug
const getCompanyVideosBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { roundType } = req.query;
        // First, find the company by slug
        const company = await prisma.company.findFirst({
            where: { slug: slug },
        });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        // Then get videos for that company
        const where = {
            companyId: company.id,
            publishedAt: {
                not: null,
            },
        };
        if (roundType && typeof roundType === 'string') {
            where.roundType = roundType;
        }
        const videos = await prisma.video.findMany({
            where,
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
