"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getAdminVideoById = exports.getAdminVideos = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const videoSchema = zod_1.z.object({
    companyId: zod_1.z.string().min(1),
    youtubeId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1),
    roundType: zod_1.z.string().optional(),
    publishedAt: zod_1.z.string().optional(),
});
// Get all videos (admin)
const getAdminVideos = async (req, res) => {
    try {
        const videos = await prisma.video.findMany({
            include: {
                company: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            data: videos,
        });
    }
    catch (error) {
        console.error('Get admin videos error:', error);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};
exports.getAdminVideos = getAdminVideos;
// Get video by ID (admin)
const getAdminVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ data: video });
    }
    catch (error) {
        console.error('Get admin video error:', error);
        res.status(500).json({ message: 'Error retrieving video' });
    }
};
exports.getAdminVideoById = getAdminVideoById;
// Create video (admin)
const createVideo = async (req, res) => {
    try {
        const videoData = videoSchema.parse(req.body);
        // Check if company exists
        const company = await prisma.company.findUnique({
            where: { id: videoData.companyId },
        });
        if (!company) {
            return res.status(400).json({ message: 'Company not found' });
        }
        const video = await prisma.video.create({
            data: {
                companyId: videoData.companyId,
                title: videoData.title,
                youtubeId: videoData.youtubeId,
                roundType: videoData.roundType,
                publishedAt: videoData.publishedAt ? new Date(videoData.publishedAt) : undefined,
            },
            include: {
                company: true,
            },
        });
        res.status(201).json({
            message: 'Video created successfully',
            data: video,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors
            });
        }
        console.error('Create video error:', error);
        res.status(500).json({ message: 'Error creating video' });
    }
};
exports.createVideo = createVideo;
// Update video (admin)
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const videoData = videoSchema.parse(req.body);
        // Check if video exists
        const existingVideo = await prisma.video.findUnique({
            where: { id },
        });
        if (!existingVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        // Check if company exists (if provided)
        if (videoData.companyId) {
            const company = await prisma.company.findUnique({
                where: { id: videoData.companyId },
            });
            if (!company) {
                return res.status(400).json({ message: 'Company not found' });
            }
        }
        const video = await prisma.video.update({
            where: { id },
            data: {
                companyId: videoData.companyId,
                title: videoData.title,
                youtubeId: videoData.youtubeId,
                roundType: videoData.roundType,
                publishedAt: videoData.publishedAt ? new Date(videoData.publishedAt) : undefined,
            },
            include: {
                company: true,
            },
        });
        res.json({
            message: 'Video updated successfully',
            data: video,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors
            });
        }
        console.error('Update video error:', error);
        res.status(500).json({ message: 'Error updating video' });
    }
};
exports.updateVideo = updateVideo;
// Delete video (admin)
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if video exists
        const existingVideo = await prisma.video.findUnique({
            where: { id },
        });
        if (!existingVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        // Delete the video
        await prisma.video.delete({
            where: { id },
        });
        res.json({ message: 'Video deleted successfully' });
    }
    catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({ message: 'Error deleting video' });
    }
};
exports.deleteVideo = deleteVideo;
