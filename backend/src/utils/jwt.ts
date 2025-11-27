import jwt from 'jsonwebtoken';
import { Role } from '../types/prisma';

interface TokenPayload {
  userId: string;
  role: Role | string;
}

type MinimalUser = { id: string; role: Role | string };

export const generateToken = (user: MinimalUser): string => {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  } as any);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateRefreshToken = (user: MinimalUser): string => {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d', // Refresh token lives longer
  } as any);
};
