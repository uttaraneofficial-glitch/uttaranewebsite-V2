"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMkStudioPost = exports.updateMkStudioPost = exports.createMkStudioPost = exports.getAdminMkStudioPostById = exports.getAdminMkStudioPosts = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const mkStudioPostSchema = zod_1.z.object({
    youtubeId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    publishedAt: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().optional(),
});
// Get all MK Studio posts (admin)
const getAdminMkStudioPosts = async (req, res) => {
    try {
        const posts = await prisma.mkStudioPost.findMany({
            orderBy: { publishedAt: 'desc' },
        });
        res.json({
            data: posts,
        });
    }
    catch (error) {
        console.error('Get admin MK Studio posts error:', error);
        res.status(500).json({ message: 'Error retrieving MK Studio posts' });
    }
};
exports.getAdminMkStudioPosts = getAdminMkStudioPosts;
// Get MK Studio post by ID (admin)
const getAdminMkStudioPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.mkStudioPost.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'MK Studio post not found' });
        }
        res.json({ data: post });
    }
    catch (error) {
        console.error('Get admin MK Studio post error:', error);
        res.status(500).json({ message: 'Error retrieving MK Studio post' });
    }
};
exports.getAdminMkStudioPostById = getAdminMkStudioPostById;
// Create MK Studio post (admin)
const createMkStudioPost = async (req, res) => {
    try {
        const postData = mkStudioPostSchema.parse(req.body);
        const post = await prisma.mkStudioPost.create({
            data: {
                youtubeId: postData.youtubeId,
                title: postData.title,
                description: postData.description,
                publishedAt: postData.publishedAt
                    ? new Date(postData.publishedAt)
                    : new Date(),
                thumbnail: postData.thumbnail,
            },
        });
        res.status(201).json({
            message: 'MK Studio post created successfully',
            data: post,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Create MK Studio post error:', error);
        res.status(500).json({ message: 'Error creating MK Studio post' });
    }
};
exports.createMkStudioPost = createMkStudioPost;
// Update MK Studio post (admin)
const updateMkStudioPost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = mkStudioPostSchema.parse(req.body);
        // Check if post exists
        const existingPost = await prisma.mkStudioPost.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'MK Studio post not found' });
        }
        const post = await prisma.mkStudioPost.update({
            where: { id },
            data: {
                youtubeId: postData.youtubeId,
                title: postData.title,
                description: postData.description,
                publishedAt: postData.publishedAt
                    ? new Date(postData.publishedAt)
                    : existingPost.publishedAt,
                thumbnail: postData.thumbnail,
            },
        });
        res.json({
            message: 'MK Studio post updated successfully',
            data: post,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Update MK Studio post error:', error);
        res.status(500).json({ message: 'Error updating MK Studio post' });
    }
};
exports.updateMkStudioPost = updateMkStudioPost;
// Delete MK Studio post (admin)
const deleteMkStudioPost = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if post exists
        const existingPost = await prisma.mkStudioPost.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'MK Studio post not found' });
        }
        // Delete the post
        await prisma.mkStudioPost.delete({
            where: { id },
        });
        res.json({ message: 'MK Studio post deleted successfully' });
    }
    catch (error) {
        console.error('Delete MK Studio post error:', error);
        res.status(500).json({ message: 'Error deleting MK Studio post' });
    }
};
exports.deleteMkStudioPost = deleteMkStudioPost;
