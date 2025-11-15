import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const siteContentSchema = z.object({
  value: z.string().optional(),
});

// Get site content by key (admin)
export const getSiteContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const content = await prisma.siteContent.findUnique({
      where: { key },
    });
    
    console.log(`Retrieved site content for key: ${key}`, content);

    if (!content) {
      // Return default empty content if not found
      return res.json({ 
        data: { 
          key, 
          value: '' 
        } 
      });
    }

    res.json({ data: content });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({ message: 'Error retrieving site content' });
  }
};

// Update site content by key (admin)
export const updateSiteContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const contentData = siteContentSchema.parse(req.body);
    
    console.log(`Updating site content for key: ${key}`, contentData);

    // Check if content exists
    const existingContent = await prisma.siteContent.findUnique({
      where: { key },
    });

    let content;
    if (existingContent) {
      // Update existing content
      content = await prisma.siteContent.update({
        where: { key },
        data: {
          value: contentData.value,
        },
      });
    } else {
      // Create new content
      content = await prisma.siteContent.create({
        data: {
          key,
          value: contentData.value,
        },
      });
    }
    
    console.log(`Updated site content for key: ${key}`, content);

    res.json({
      message: 'Site content updated successfully',
      data: content,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: error.errors 
      });
    }
    console.error('Update site content error:', error);
    res.status(500).json({ message: 'Error updating site content' });
  }
};