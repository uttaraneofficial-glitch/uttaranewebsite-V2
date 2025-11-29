import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {
  candidateSchema,
  candidateUpdateSchema,
} from '../../schemas/candidates.schema';
import cloudinary from '../../config/cloudinary';

const prisma = new PrismaClient();

// Get all candidates (admin)
export const getAdminCandidates = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Get admin candidates error:', error);
    res.status(500).json({ message: 'Error retrieving candidates' });
  }
};

// Get candidate by ID (admin)
export const getAdminCandidateById = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Get admin candidate error:', error);
    res.status(500).json({ message: 'Error retrieving candidate' });
  }
};

// Create candidate (admin)
export const createCandidate = async (req: Request, res: Response) => {
  try {
    let profileImageUrl = req.body.profileImageUrl;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uttarane/candidates',
      });
      profileImageUrl = uploadResult.secure_url;
    }

    const candidateData = candidateSchema.parse({
      ...req.body,
      profileImageUrl,
    });

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Create candidate error:', error);
    res.status(500).json({ message: 'Error creating candidate' });
  }
};

// Update candidate (admin)
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let profileImageUrl = req.body.profileImageUrl;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uttarane/candidates',
      });
      profileImageUrl = uploadResult.secure_url;
    }

    const candidateData = candidateUpdateSchema.parse({
      ...req.body,
      profileImageUrl,
    });

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Update candidate error:', error);
    res.status(500).json({ message: 'Error updating candidate' });
  }
};

// Delete candidate (admin)
export const deleteCandidate = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ message: 'Error deleting candidate' });
  }
};
