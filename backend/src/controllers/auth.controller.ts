import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import {
  checkLoginAttempts,
  resetLoginAttempts,
  getRemainingAttempts,
  getAccountLockoutTime,
} from '../services/account-lockout';

const prisma = new PrismaClient();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Check for account lockout
    const canLogin = await checkLoginAttempts(username);
    if (!canLogin) {
      const lockoutTime = getAccountLockoutTime(username);
      return res.status(429).json({
        message: 'Account temporarily locked due to too many failed attempts',
        lockedUntil: lockoutTime,
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      const remainingAttempts = getRemainingAttempts(username);
      return res.status(401).json({
        message: 'Invalid credentials',
        remainingAttempts,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const remainingAttempts = getRemainingAttempts(username);
      return res.status(401).json({
        message: 'Invalid credentials',
        remainingAttempts,
      });
    }

    // Reset login attempts on successful login
    resetLoginAttempts(username);

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set HttpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateToken(user);
    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
};
