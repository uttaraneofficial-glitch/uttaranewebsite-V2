"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNgoPost = exports.updateNgoPost = exports.createNgoPost = exports.getAdminNgoPostById = exports.getAdminNgoPosts = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const ngoPostSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url(),
    caption: zod_1.z.string().optional(),
    postedAt: zod_1.z.string().optional(),
});
// Get all NGO posts (admin)
const getAdminNgoPosts = async (req, res) => {
    try {
        const posts = await prisma.ngoPost.findMany({
            orderBy: { postedAt: 'desc' },
        });
        res.json({
            data: posts,
        });
    }
    catch (error) {
        console.error('Get admin NGO posts error:', error);
        res.status(500).json({ message: 'Error retrieving NGO posts' });
    }
};
exports.getAdminNgoPosts = getAdminNgoPosts;
// Get NGO post by ID (admin)
const getAdminNgoPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.ngoPost.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'NGO post not found' });
        }
        res.json({ data: post });
    }
    catch (error) {
        console.error('Get admin NGO post error:', error);
        res.status(500).json({ message: 'Error retrieving NGO post' });
    }
};
exports.getAdminNgoPostById = getAdminNgoPostById;
// Create NGO post (admin)
const createNgoPost = async (req, res) => {
    try {
        const postData = ngoPostSchema.parse(req.body);
        const post = await prisma.ngoPost.create({
            data: {
                imageUrl: postData.imageUrl,
                caption: postData.caption,
                postedAt: postData.postedAt ? new Date(postData.postedAt) : new Date(),
            },
        });
        res.status(201).json({
            message: 'NGO post created successfully',
            data: post,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors
            });
        }
        console.error('Create NGO post error:', error);
        res.status(500).json({ message: 'Error creating NGO post' });
    }
};
exports.createNgoPost = createNgoPost;
// Update NGO post (admin)
const updateNgoPost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = ngoPostSchema.parse(req.body);
        // Check if post exists
        const existingPost = await prisma.ngoPost.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'NGO post not found' });
        }
        const post = await prisma.ngoPost.update({
            where: { id },
            data: {
                imageUrl: postData.imageUrl,
                caption: postData.caption,
                postedAt: postData.postedAt ? new Date(postData.postedAt) : undefined,
            },
        });
        res.json({
            message: 'NGO post updated successfully',
            data: post,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors
            });
        }
        console.error('Update NGO post error:', error);
        res.status(500).json({ message: 'Error updating NGO post' });
    }
};
exports.updateNgoPost = updateNgoPost;
// Delete NGO post (admin)
const deleteNgoPost = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if post exists
        const existingPost = await prisma.ngoPost.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'NGO post not found' });
        }
        // Delete the post
        await prisma.ngoPost.delete({
            where: { id },
        });
        res.json({ message: 'NGO post deleted successfully' });
    }
    catch (error) {
        console.error('Delete NGO post error:', error);
        res.status(500).json({ message: 'Error deleting NGO post' });
    }
};
exports.deleteNgoPost = deleteNgoPost;
