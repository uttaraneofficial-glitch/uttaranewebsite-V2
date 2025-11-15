"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = exports.AuditAction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
var AuditAction;
(function (AuditAction) {
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditAction["PASSWORD_RESET_REQUEST"] = "PASSWORD_RESET_REQUEST";
    AuditAction["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditAction["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditAction["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    AuditAction["ACCOUNT_UNLOCKED"] = "ACCOUNT_UNLOCKED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
class AuditLogger {
    static async log(entry) {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: entry.userId,
                    action: entry.action,
                    ipAddress: entry.ipAddress,
                    userAgent: entry.userAgent,
                    details: entry.details ? JSON.stringify(entry.details) : null,
                    timestamp: new Date()
                }
            });
        }
        catch (error) {
            console.error('Audit log error:', error);
            // Don't throw - logging should not break the main flow
        }
    }
    static getRequestInfo(req) {
        return {
            ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
            userAgent: req.get('user-agent') || 'unknown',
        };
    }
    static async getUserActivity(userId, limit = 10) {
        return prisma.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: limit
        });
    }
    static async getSecurityEvents(options) {
        return prisma.auditLog.findMany({
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (options.action && { action: options.action })), (options.userId && { userId: options.userId })), (options.ipAddress && { ipAddress: options.ipAddress })), (options.startDate && options.endDate && {
                timestamp: {
                    gte: options.startDate,
                    lte: options.endDate
                }
            })),
            orderBy: { timestamp: 'desc' },
            take: options.limit || 50
        });
    }
}
exports.AuditLogger = AuditLogger;
