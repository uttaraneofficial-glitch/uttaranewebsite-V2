import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const companySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().optional(),
  shortBio: z.string().optional(),
  orderIndex: z.number().optional(),
  thumbnail: z.string().optional(),
});

// Get all companies (admin)
export const getAdminCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        candidates: true, // Include candidates in response
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      data: companies,
    });
  } catch (error) {
    console.error('Get admin companies error:', error);
    res.status(500).json({ message: 'Error retrieving companies' });
  }
};

// Get company by ID (admin)
export const getAdminCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        candidates: true, // Include candidates in response
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ data: company });
  } catch (error) {
    console.error('Get admin company error:', error);
    res.status(500).json({ message: 'Error retrieving company' });
  }
};

// Create company (admin)
export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyData = companySchema.parse(req.body);

    // Check if company with same name or slug already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { name: companyData.name },
          { slug: companyData.slug },
        ],
      },
    });

    if (existingCompany) {
      return res.status(400).json({ 
        message: 'Company with this name or slug already exists' 
      });
    }

    const company = await prisma.company.create({
      data: {
        name: companyData.name,
        slug: companyData.slug,
        logoUrl: companyData.logoUrl,
        shortBio: companyData.shortBio,
        orderIndex: companyData.orderIndex,
        thumbnail: companyData.thumbnail,
      },
    });

    res.status(201).json({
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: error.errors 
      });
    }
    console.error('Create company error:', error);
    res.status(500).json({ message: 'Error creating company' });
  }
};

// Update company (admin)
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyData = companySchema.parse(req.body);

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if another company with same name or slug already exists
    const duplicateCompany = await prisma.company.findFirst({
      where: {
        id: { not: id },
        OR: [
          { name: companyData.name },
          { slug: companyData.slug },
        ],
      },
    });

    if (duplicateCompany) {
      return res.status(400).json({ 
        message: 'Another company with this name or slug already exists' 
      });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: companyData.name,
        slug: companyData.slug,
        logoUrl: companyData.logoUrl,
        shortBio: companyData.shortBio,
        orderIndex: companyData.orderIndex,
        thumbnail: companyData.thumbnail,
      },
    });

    res.json({
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: error.errors 
      });
    }
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Error updating company' });
  }
};

// Delete company (admin)
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Delete associated videos first (due to foreign key constraint)
    await prisma.video.deleteMany({
      where: { companyId: id },
    });

    // Delete the company
    await prisma.company.delete({
      where: { id },
    });

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Error deleting company' });
  }
};