"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
class SessionManager {
    static async createSession(userId, req) {
        const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + SESSION_DURATION);
        await prisma.userSession.create({
            data: {
                userId,
                refreshToken,
                ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
                userAgent: req.get('user-agent') || 'unknown',
                expiresAt,
            },
        });
        return refreshToken;
    }
    static async validateSession(refreshToken) {
        const session = await prisma.userSession.findUnique({
            where: { refreshToken },
        });
        if (!session || session.isRevoked || session.expiresAt < new Date()) {
            return false;
        }
        // Update last used timestamp
        await prisma.userSession.update({
            where: { id: session.id },
            data: { lastUsedAt: new Date() },
        });
        return true;
    }
    static async revokeSession(refreshToken) {
        await prisma.userSession.update({
            where: { refreshToken },
            data: { isRevoked: true },
        });
    }
    static async revokeAllUserSessions(userId) {
        await prisma.userSession.updateMany({
            where: { userId },
            data: { isRevoked: true },
        });
    }
    static async cleanupExpiredSessions() {
        const result = await prisma.userSession.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { isRevoked: true },
                ],
            },
        });
        return result.count;
    }
    static async getUserActiveSessions(userId) {
        return prisma.userSession.findMany({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { lastUsedAt: 'desc' },
        });
    }
}
exports.SessionManager = SessionManager;
