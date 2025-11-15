"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// In a real application, this would be stored in Redis or a database
const passwordResetTokens = new Map();
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = zod_1.z.object({ email: zod_1.z.string().email() }).parse(req.body);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // Return success even if user doesn't exist to prevent email enumeration
            return res.json({ message: 'If your email exists in our system, you will receive a password reset link' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        // Store token with expiry (1 hour)
        const expires = new Date(Date.now() + 3600000);
        passwordResetTokens.set(hashedToken, {
            userId: user.id,
            expires,
        });
        // In a real application, send email with reset token
        // For development, we'll return the token in the response
        if (process.env.NODE_ENV === 'development') {
            return res.json({
                message: 'Password reset link sent',
                debug: { resetToken },
            });
        }
        res.json({ message: 'If your email exists in our system, you will receive a password reset link' });
    }
    catch (error) {
        console.error('Password reset request error:', error);
        res.status(400).json({ message: 'Invalid input' });
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = zod_1.z.object({
            token: zod_1.z.string(),
            newPassword: zod_1.z.string().min(8),
        }).parse(req.body);
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const storedToken = passwordResetTokens.get(hashedToken);
        if (!storedToken || storedToken.expires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: storedToken.userId },
            data: { password: hashedPassword },
        });
        // Remove used token
        passwordResetTokens.delete(hashedToken);
        res.json({ message: 'Password successfully reset' });
    }
    catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ message: 'Invalid input' });
    }
};
exports.resetPassword = resetPassword;
