"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePublishVideo = exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getVideoById = exports.getVideos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all videos
const getVideos = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '', isPublished } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        let where = {};
        if (search) {
            where = {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        if (isPublished !== undefined) {
            where.isPublished = isPublished === 'true';
        }
        const videos = await prisma.video.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });
        const total = await prisma.video.count({ where });
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
        console.error('Get videos error:', error);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};
exports.getVideos = getVideos;
// Get video by ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await prisma.video.findUnique({
            where: { id },
        });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ data: video });
    }
    catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({ message: 'Error retrieving video' });
    }
};
exports.getVideoById = getVideoById;
// Create video
const createVideo = async (req, res) => {
    try {
        const { title, description, url, thumbnailUrl, duration, isPublished } = req.body;
        const video = await prisma.video.create({
            data: {
                title,
                description,
                url,
                thumbnailUrl,
                duration,
                isPublished,
            },
        });
        res.status(201).json({ data: video, message: 'Video created successfully' });
    }
    catch (error) {
        console.error('Create video error:', error);
        res.status(500).json({ message: 'Error creating video' });
    }
};
exports.createVideo = createVideo;
// Update video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, url, thumbnailUrl, duration, isPublished } = req.body;
        // Check if video exists
        const existingVideo = await prisma.video.findUnique({
            where: { id },
        });
        if (!existingVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        const video = await prisma.video.update({
            where: { id },
            data: {
                title,
                description,
                url,
                thumbnailUrl,
                duration,
                isPublished,
            },
        });
        res.json({ data: video, message: 'Video updated successfully' });
    }
    catch (error) {
        console.error('Update video error:', error);
        res.status(500).json({ message: 'Error updating video' });
    }
};
exports.updateVideo = updateVideo;
// Delete video
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
// Publish/unpublish video
const togglePublishVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;
        // Check if video exists
        const existingVideo = await prisma.video.findUnique({
            where: { id },
        });
        if (!existingVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        const video = await prisma.video.update({
            where: { id },
            data: {
                isPublished,
            },
        });
        res.json({
            data: video,
            message: `Video ${isPublished ? 'published' : 'unpublished'} successfully`
        });
    }
    catch (error) {
        console.error('Toggle publish video error:', error);
        res.status(500).json({ message: 'Error toggling video publish status' });
    }
};
exports.togglePublishVideo = togglePublishVideo;
