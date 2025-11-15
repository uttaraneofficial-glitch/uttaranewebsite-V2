import { Request } from 'express';
import { Role } from './prisma';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export interface TokenPayload {
  userId: string;
  role: Role;
}
