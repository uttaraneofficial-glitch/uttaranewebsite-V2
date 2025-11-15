import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const mkStudioPostSchema = z.object({
  youtubeId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  publishedAt: z.string().optional(),
  thumbnail: z.string().optional(),
});

// Get all MK Studio posts (admin)
export const getAdminMkStudioPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.mkStudioPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.error('Get admin MK Studio posts error:', error);
    res.status(500).json({ message: 'Error retrieving MK Studio posts' });
  }
};

// Get MK Studio post by ID (admin)
export const getAdminMkStudioPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.mkStudioPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: 'MK Studio post not found' });
    }

    res.json({ data: post });
  } catch (error) {
    console.error('Get admin MK Studio post error:', error);
    res.status(500).json({ message: 'Error retrieving MK Studio post' });
  }
};

// Create MK Studio post (admin)
export const createMkStudioPost = async (req: Request, res: Response) => {
  try {
    const postData = mkStudioPostSchema.parse(req.body);

    const post = await prisma.mkStudioPost.create({
      data: {
        youtubeId: postData.youtubeId,
        title: postData.title,
        description: postData.description,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
        thumbnail: postData.thumbnail,
      },
    });

    res.status(201).json({
      message: 'MK Studio post created successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: error.errors 
      });
    }
    console.error('Create MK Studio post error:', error);
    res.status(500).json({ message: 'Error creating MK Studio post' });
  }
};

// Update MK Studio post (admin)
export const updateMkStudioPost = async (req: Request, res: Response) => {
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
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : existingPost.publishedAt,
        thumbnail: postData.thumbnail,
      },
    });

    res.json({
      message: 'MK Studio post updated successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: error.errors 
      });
    }
    console.error('Update MK Studio post error:', error);
    res.status(500).json({ message: 'Error updating MK Studio post' });
  }
};

// Delete MK Studio post (admin)
export const deleteMkStudioPost = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Delete MK Studio post error:', error);
    res.status(500).json({ message: 'Error deleting MK Studio post' });
  }
};