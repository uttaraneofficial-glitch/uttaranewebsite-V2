"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteContent = exports.getSiteContent = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const siteContentSchema = zod_1.z.object({
    value: zod_1.z.string().optional(),
});
// Get site content by key (admin)
const getSiteContent = async (req, res) => {
    try {
        const { key } = req.params;
        const content = await prisma.siteContent.findUnique({
            where: { key },
        });
        if (!content) {
            // Return default empty content if not found
            return res.json({
                data: {
                    key,
                    value: ''
                }
            });
        }
        res.json({ data: content });
    }
    catch (error) {
        console.error('Get site content error:', error);
        res.status(500).json({ message: 'Error retrieving site content' });
    }
};
exports.getSiteContent = getSiteContent;
// Update site content by key (admin)
const updateSiteContent = async (req, res) => {
    try {
        const { key } = req.params;
        const contentData = siteContentSchema.parse(req.body);
        // Check if content exists
        const existingContent = await prisma.siteContent.findUnique({
            where: { key },
        });
        let content;
        if (existingContent) {
            // Update existing content
            content = await prisma.siteContent.update({
                where: { key },
                data: {
                    value: contentData.value,
                },
            });
        }
        else {
            // Create new content
            content = await prisma.siteContent.create({
                data: {
                    key,
                    value: contentData.value,
                },
            });
        }
        res.json({
            message: 'Site content updated successfully',
            data: content,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors
            });
        }
        console.error('Update site content error:', error);
        res.status(500).json({ message: 'Error updating site content' });
    }
};
exports.updateSiteContent = updateSiteContent;
