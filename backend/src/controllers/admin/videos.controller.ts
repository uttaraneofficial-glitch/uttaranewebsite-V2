import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const videoSchema = z.object({
  companyId: z.string().min(1),
  youtubeId: z.string().optional(),
  title: z.string().min(1),
  roundType: z.string().optional(),
  publishedAt: z.string().optional(),
  thumbnail: z.string().optional(),
  candidateId: z.string().optional(), // Add candidateId field
});

// Get all videos (admin)
export const getAdminVideos = async (req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        company: true,
        candidate: true, // Include candidate in response
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: videos,
    });
  } catch (error) {
    console.error('Get admin videos error:', error);
    res.status(500).json({ message: 'Error retrieving videos' });
  }
};

// Get video by ID (admin)
export const getAdminVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        company: true,
        candidate: true, // Include candidate in response
      },
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ data: video });
  } catch (error) {
    console.error('Get admin video error:', error);
    res.status(500).json({ message: 'Error retrieving video' });
  }
};

// Create video (admin)
export const createVideo = async (req: Request, res: Response) => {
  try {
    const videoData = videoSchema.parse(req.body);

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: videoData.companyId },
    });

    if (!company) {
      return res.status(400).json({ message: 'Company not found' });
    }

    // Check if candidate exists (if provided)
    let candidate = null;
    if (videoData.candidateId) {
      candidate = await prisma.candidate.findUnique({
        where: { id: videoData.candidateId },
      });

      if (!candidate) {
        return res.status(400).json({ message: 'Candidate not found' });
      }
    }

    const video = await prisma.video.create({
      data: {
        companyId: videoData.companyId,
        title: videoData.title,
        youtubeId: videoData.youtubeId,
        roundType: videoData.roundType,
        publishedAt: videoData.publishedAt
          ? new Date(videoData.publishedAt)
          : null,
        thumbnail: videoData.thumbnail,
        candidateId: videoData.candidateId, // Add candidateId to video creation
      },
      include: {
        company: true,
        candidate: true, // Include candidate in response
      },
    });

    res.status(201).json({
      message: 'Video created successfully',
      data: video,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Error creating video' });
  }
};

// Update video (admin)
export const updateVideo = async (req: Request, res: Response) => {
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
    let company = null;
    if (videoData.companyId) {
      company = await prisma.company.findUnique({
        where: { id: videoData.companyId },
      });

      if (!company) {
        return res.status(400).json({ message: 'Company not found' });
      }
    }

    // Check if candidate exists (if provided)
    let candidate = null;
    if (videoData.candidateId) {
      candidate = await prisma.candidate.findUnique({
        where: { id: videoData.candidateId },
      });

      if (!candidate) {
        return res.status(400).json({ message: 'Candidate not found' });
      }
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        companyId: videoData.companyId,
        title: videoData.title,
        youtubeId: videoData.youtubeId,
        roundType: videoData.roundType,
        publishedAt: videoData.publishedAt
          ? new Date(videoData.publishedAt)
          : existingVideo.publishedAt,
        thumbnail: videoData.thumbnail,
        candidateId: videoData.candidateId, // Add candidateId to video update
      },
      include: {
        company: true,
        candidate: true, // Include candidate in response
      },
    });

    res.json({
      message: 'Video updated successfully',
      data: video,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Error updating video' });
  }
};

// Delete video (admin)
export const deleteVideo = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};
