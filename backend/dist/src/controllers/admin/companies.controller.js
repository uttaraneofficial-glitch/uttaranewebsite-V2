"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getAdminCompanyById = exports.getAdminCompanies = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    logoUrl: zod_1.z.string().optional(),
    shortBio: zod_1.z.string().optional(),
    orderIndex: zod_1.z.number().optional(),
    thumbnail: zod_1.z.string().optional(),
    bannerUrl: zod_1.z.string().optional(),
});
// Get all companies (admin)
const getAdminCompanies = async (req, res) => {
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
        console.error('Get admin companies error:', error);
        res.status(500).json({ message: 'Error retrieving companies' });
    }
};
exports.getAdminCompanies = getAdminCompanies;
// Get company by ID (admin)
const getAdminCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await prisma.company.findUnique({
            where: { id },
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
        console.error('Get admin company error:', error);
        res.status(500).json({ message: 'Error retrieving company' });
    }
};
exports.getAdminCompanyById = getAdminCompanyById;
// Create company (admin)
const createCompany = async (req, res) => {
    try {
        const companyData = companySchema.parse(req.body);
        // Check if company with same name or slug already exists
        const existingCompany = await prisma.company.findFirst({
            where: {
                OR: [{ name: companyData.name }, { slug: companyData.slug }],
            },
        });
        if (existingCompany) {
            return res.status(400).json({
                message: 'Company with this name or slug already exists',
            });
        }
        const company = await prisma.company.create({
            data: {
                name: companyData.name,
                slug: companyData.slug,
                logoUrl: companyData.logoUrl,
                shortBio: companyData.shortBio,
                orderIndex: companyData.orderIndex,
                thumbnail: companyData.thumbnail,
                bannerUrl: companyData.bannerUrl,
            },
        });
        res.status(201).json({
            message: 'Company created successfully',
            data: company,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Create company error:', error);
        res.status(500).json({ message: 'Error creating company' });
    }
};
exports.createCompany = createCompany;
// Update company (admin)
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const companyData = companySchema.parse(req.body);
        // Check if company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        // Check if another company with same name or slug already exists
        const duplicateCompany = await prisma.company.findFirst({
            where: {
                id: { not: id },
                OR: [{ name: companyData.name }, { slug: companyData.slug }],
            },
        });
        if (duplicateCompany) {
            return res.status(400).json({
                message: 'Another company with this name or slug already exists',
            });
        }
        const company = await prisma.company.update({
            where: { id },
            data: {
                name: companyData.name,
                slug: companyData.slug,
                logoUrl: companyData.logoUrl,
                shortBio: companyData.shortBio,
                orderIndex: companyData.orderIndex,
                thumbnail: companyData.thumbnail,
                bannerUrl: companyData.bannerUrl,
            },
        });
        res.json({
            message: 'Company updated successfully',
            data: company,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Update company error:', error);
        res.status(500).json({ message: 'Error updating company' });
    }
};
exports.updateCompany = updateCompany;
// Delete company (admin)
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        // Delete associated videos first (due to foreign key constraint)
        await prisma.video.deleteMany({
            where: { companyId: id },
        });
        // Delete the company
        await prisma.company.delete({
            where: { id },
        });
        res.json({ message: 'Company deleted successfully' });
    }
    catch (error) {
        console.error('Delete company error:', error);
        res.status(500).json({ message: 'Error deleting company' });
    }
};
exports.deleteCompany = deleteCompany;
