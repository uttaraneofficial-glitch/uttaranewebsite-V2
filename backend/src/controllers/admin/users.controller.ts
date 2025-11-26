import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8).optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

const passwordSchema = z.object({
  password: z.string().min(8),
});

// Get all users (admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

// Get user by ID (admin)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
};

// Create user (admin)
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.parse(req.body);

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password if provided
    let hashedPassword = '';
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 12);
    }

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
        role: userData.role || 'USER',
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update user (admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData = userSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is being changed and if it already exists
    if (userData.username && userData.username !== existingUser.username) {
      const userWithSameUsername = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (userWithSameUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Prepare update data
    const updateData: any = {
      username: userData.username,
      role: userData.role,
    };

    // Hash password if provided
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the main admin user
    if (
      existingUser.username === process.env.ADMIN_USERNAME ||
      existingUser.role === 'ADMIN'
    ) {
      // Check if this is the only admin user
      const adminUsers = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminUsers <= 1) {
        return res
          .status(400)
          .json({ message: 'Cannot delete the last admin user' });
      }
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Change user password (admin)
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const passwordData = passwordSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(passwordData.password, 12);

    // Update the password
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors,
      });
    }
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};
