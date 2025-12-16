import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all public companies (alphabetical order)
// Get all public companies (alphabetical order)
export const getPublicCompanies = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const queryOptions: any = {
      orderBy: { name: 'asc' },
    };

    // If limit is provided, use it and don't include candidates which are heavy
    if (limit) {
      const parsedLimit = parseInt(limit as string);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        queryOptions.take = parsedLimit;
        // Optimization: For homepage (limited results), typically we don't need full candidate list
        // But if we do need it, we can keep it. Homepage doesn't use candidates.
        queryOptions.include = {
          candidates: false, // Don't fetch candidates when limiting (usually homepage)
        };
      } else {
        queryOptions.include = { candidates: true };
      }
    } else {
      queryOptions.include = { candidates: true };
    }

    const companies = await prisma.company.findMany(queryOptions);

    res.json({
      data: companies,
    });
  } catch (error) {
    console.error('Get public companies error:', error);
    res.status(500).json({ message: 'Error retrieving companies' });
  }
};

// Get public company by slug (case-insensitive)
export const getPublicCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Find company with case-insensitive slug matching
    const company = await prisma.company.findFirst({
      where: {
        slug: {
          mode: 'insensitive',
          equals: slug,
        },
      },
      include: {
        candidates: true, // Include candidates in response
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ data: company });
  } catch (error) {
    console.error('Get public company error:', error);
    res.status(500).json({ message: 'Error retrieving company' });
  }
};

// Get videos for a company by slug (case-insensitive)
export const getCompanyVideosBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { roundType } = req.query;

    // First, find the company by slug (case-insensitive)
    const company = await prisma.company.findFirst({
      where: {
        slug: {
          mode: 'insensitive',
          equals: slug,
        },
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Then get videos for that company with candidate information
    const where: { [key: string]: string | { not: null } | undefined } = {
      companyId: company.id,
      publishedAt: {
        not: null,
      },
    };

    // Add roundType filter if provided
    if (roundType && typeof roundType === 'string') {
      where.roundType = roundType;
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        candidate: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    res.json({
      data: videos,
    });
  } catch (error) {
    console.error('Get company videos error:', error);
    res.status(500).json({ message: 'Error retrieving videos' });
  }
};

// Get all candidates with company info
export const getPublicCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
            thumbnail: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      data: candidates,
    });
  } catch (error) {
    console.error('Get public candidates error:', error);
    res.status(500).json({ message: 'Error retrieving candidates' });
  }
};
