"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getCompanyById = exports.getCompanies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all companies
const getCompanies = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
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
        console.error('Get companies error:', error);
        res.status(500).json({ message: 'Error retrieving companies' });
    }
};
exports.getCompanies = getCompanies;
// Get company by ID
const getCompanyById = async (req, res) => {
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
        console.error('Get company error:', error);
        res.status(500).json({ message: 'Error retrieving company' });
    }
};
exports.getCompanyById = getCompanyById;
// Create company
const createCompany = async (req, res) => {
    try {
        const { name, description } = req.body;
        // Check if company with same name already exists
        const existingCompany = await prisma.company.findUnique({
            where: { name },
        });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company with this name already exists' });
        }
        const company = await prisma.company.create({
            data: {
                name,
                description,
            },
        });
        res.status(201).json({ data: company, message: 'Company created successfully' });
    }
    catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ message: 'Error creating company' });
    }
};
exports.createCompany = createCompany;
// Update company
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        // Check if company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        // Check if another company with same name already exists
        if (name && name !== existingCompany.name) {
            const duplicateCompany = await prisma.company.findUnique({
                where: { name },
            });
            if (duplicateCompany) {
                return res.status(400).json({ message: 'Company with this name already exists' });
            }
        }
        const company = await prisma.company.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
        res.json({ data: company, message: 'Company updated successfully' });
    }
    catch (error) {
        console.error('Update company error:', error);
        res.status(500).json({ message: 'Error updating company' });
    }
};
exports.updateCompany = updateCompany;
// Delete company
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
        // Check if company has associated users or interview sessions
        const usersCount = await prisma.user.count({
            where: { companyId: id },
        });
        const sessionsCount = await prisma.interviewSession.count({
            where: { companyId: id },
        });
        if (usersCount > 0 || sessionsCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete company with associated users or interview sessions'
            });
        }
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
