import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

// Basic security headers using helmet
export const securityHeaders = helmet();

// Prevent HTTP Parameter Pollution
export const preventPollution = hpp();

// Custom security headers
export const additionalSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Strict Transport Security
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Disable client-side caching for authenticated routes
  if (req.path.startsWith('/api/') && req.path !== '/api/auth/login') {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};
