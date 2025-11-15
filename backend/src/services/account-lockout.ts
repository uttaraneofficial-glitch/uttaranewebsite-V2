import { Request } from 'express';

// In-memory store for login attempts (in production, use Redis or database)
const loginAttempts: Record<string, { attempts: number; lastAttempt: Date }> =
  {};

// Configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

export const checkLoginAttempts = async (
  username: string
): Promise<boolean> => {
  const attempt = loginAttempts[username];

  if (!attempt) {
    return true; // No previous attempts
  }

  const now = new Date();
  const timeSinceLastAttempt = now.getTime() - attempt.lastAttempt.getTime();

  // Reset attempts if outside the window
  if (timeSinceLastAttempt > ATTEMPT_WINDOW) {
    delete loginAttempts[username];
    return true;
  }

  // Check if account is locked
  if (attempt.attempts >= MAX_ATTEMPTS) {
    const lockoutTime = new Date(
      attempt.lastAttempt.getTime() + LOCKOUT_DURATION
    );
    if (now < lockoutTime) {
      return false; // Account is locked
    } else {
      // Lockout period expired, reset attempts
      delete loginAttempts[username];
      return true;
    }
  }

  return true; // Not locked yet
};

export const resetLoginAttempts = async (username: string): Promise<void> => {
  delete loginAttempts[username];
};

export const getRemainingAttempts = (username: string): number => {
  const attempt = loginAttempts[username];
  if (!attempt) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - attempt.attempts);
};

export const getAccountLockoutTime = (username: string): Date | null => {
  const attempt = loginAttempts[username];
  if (!attempt || attempt.attempts < MAX_ATTEMPTS) return null;

  const lockoutTime = new Date(
    attempt.lastAttempt.getTime() + LOCKOUT_DURATION
  );
  return lockoutTime > new Date() ? lockoutTime : null;
};

// Middleware to track login attempts
export const trackLoginAttempt = (req: Request, success: boolean): void => {
  const { username } = req.body;
  if (!username) return;

  const now = new Date();

  if (success) {
    // Reset on successful login
    resetLoginAttempts(username);
  } else {
    // Track failed attempt
    const attempt = loginAttempts[username] || {
      attempts: 0,
      lastAttempt: now,
    };
    attempt.attempts += 1;
    attempt.lastAttempt = now;
    loginAttempts[username] = attempt;
  }
};
