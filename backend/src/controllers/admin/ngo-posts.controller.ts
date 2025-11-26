import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const ngoPostSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional(),
});

// Get all NGO posts (admin)
export const getAdminNgoPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.ngoPost.findMany({
      orderBy: { postedAt: 'desc' },
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.error('Get admin NGO posts error:', error);
    res.status(500).json({ message: 'Error retrieving NGO posts' });
  }
};

// Get NGO post by ID (admin)
export const getAdminNgoPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.ngoPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: 'NGO post not found' });
    }

    res.json({ data: post });
  } catch (error) {
    console.error('Get admin NGO post error:', error);
    res.status(500).json({ message: 'Error retrieving NGO post' });
  }
};

// Create NGO post (admin)
export const createNgoPost = async (req: Request, res: Response) => {
  try {
    const postData = ngoPostSchema.parse(req.body);

    const post = await prisma.ngoPost.create({
      data: {
        imageUrl: postData.imageUrl,
        caption: postData.caption,
        postedAt: new Date(),
      },
    });

    res.status(201).json({
      message: 'NGO post created successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Create NGO post error:', error);
    res.status(500).json({ message: 'Error creating NGO post' });
  }
};

// Update NGO post (admin)
export const updateNgoPost = async (req: Request, res: Response) => {
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
      },
    });

    res.json({
      message: 'NGO post updated successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Update NGO post error:', error);
    res.status(500).json({ message: 'Error updating NGO post' });
  }
};

// Delete NGO post (admin)
export const deleteNgoPost = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Delete NGO post error:', error);
    res.status(500).json({ message: 'Error deleting NGO post' });
  }
};
