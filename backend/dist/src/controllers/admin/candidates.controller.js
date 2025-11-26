"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCandidate = exports.updateCandidate = exports.createCandidate = exports.getAdminCandidateById = exports.getAdminCandidates = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const candidates_schema_1 = require("../../schemas/candidates.schema");
const prisma = new client_1.PrismaClient();
// Get all candidates (admin)
const getAdminCandidates = async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany({
            include: {
                company: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            data: candidates,
        });
    }
    catch (error) {
        console.error('Get admin candidates error:', error);
        res.status(500).json({ message: 'Error retrieving candidates' });
    }
};
exports.getAdminCandidates = getAdminCandidates;
// Get candidate by ID (admin)
const getAdminCandidateById = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await prisma.candidate.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json({ data: candidate });
    }
    catch (error) {
        console.error('Get admin candidate error:', error);
        res.status(500).json({ message: 'Error retrieving candidate' });
    }
};
exports.getAdminCandidateById = getAdminCandidateById;
// Create candidate (admin)
const createCandidate = async (req, res) => {
    try {
        const candidateData = candidates_schema_1.candidateSchema.parse(req.body);
        // Check if company exists
        const company = await prisma.company.findUnique({
            where: { id: candidateData.companyId },
        });
        if (!company) {
            return res.status(400).json({ message: 'Company not found' });
        }
        const candidate = await prisma.candidate.create({
            data: {
                name: candidateData.name,
                college: candidateData.college,
                branch: candidateData.branch,
                graduationYear: candidateData.graduationYear,
                roleOffered: candidateData.roleOffered,
                packageOffered: candidateData.packageOffered,
                profileImageUrl: candidateData.profileImageUrl,
                quote: candidateData.quote,
                linkedinUrl: candidateData.linkedinUrl,
                companyId: candidateData.companyId,
            },
            include: {
                company: true,
            },
        });
        res.status(201).json({
            message: 'Candidate created successfully',
            data: candidate,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Create candidate error:', error);
        res.status(500).json({ message: 'Error creating candidate' });
    }
};
exports.createCandidate = createCandidate;
// Update candidate (admin)
const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const candidateData = candidates_schema_1.candidateUpdateSchema.parse(req.body);
        // Check if candidate exists
        const existingCandidate = await prisma.candidate.findUnique({
            where: { id },
        });
        if (!existingCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        // Check if company exists (if provided)
        if (candidateData.companyId) {
            const company = await prisma.company.findUnique({
                where: { id: candidateData.companyId },
            });
            if (!company) {
                return res.status(400).json({ message: 'Company not found' });
            }
        }
        const candidate = await prisma.candidate.update({
            where: { id },
            data: {
                name: candidateData.name,
                college: candidateData.college,
                branch: candidateData.branch,
                graduationYear: candidateData.graduationYear,
                roleOffered: candidateData.roleOffered,
                packageOffered: candidateData.packageOffered,
                profileImageUrl: candidateData.profileImageUrl,
                quote: candidateData.quote,
                linkedinUrl: candidateData.linkedinUrl,
                companyId: candidateData.companyId,
            },
            include: {
                company: true,
            },
        });
        res.json({
            message: 'Candidate updated successfully',
            data: candidate,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Update candidate error:', error);
        res.status(500).json({ message: 'Error updating candidate' });
    }
};
exports.updateCandidate = updateCandidate;
// Delete candidate (admin)
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if candidate exists
        const existingCandidate = await prisma.candidate.findUnique({
            where: { id },
        });
        if (!existingCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        // Delete the candidate
        await prisma.candidate.delete({
            where: { id },
        });
        res.json({ message: 'Candidate deleted successfully' });
    }
    catch (error) {
        console.error('Delete candidate error:', error);
        res.status(500).json({ message: 'Error deleting candidate' });
    }
};
exports.deleteCandidate = deleteCandidate;
