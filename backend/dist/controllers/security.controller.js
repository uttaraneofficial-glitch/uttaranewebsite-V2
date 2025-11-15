"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityEvents = exports.revokeAllSessions = exports.revokeSession = exports.getUserSessions = exports.getUserActivity = void 0;
const audit_logger_1 = require("../services/audit-logger");
const session_manager_1 = require("../services/session-manager");
const prisma_1 = require("../types/prisma");
const getUserActivity = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const activity = await audit_logger_1.AuditLogger.getUserActivity(req.user.userId);
        res.json(activity);
    }
    catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({ message: 'Error retrieving user activity' });
    }
};
exports.getUserActivity = getUserActivity;
const getUserSessions = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const sessions = await session_manager_1.SessionManager.getUserActiveSessions(req.user.userId);
        res.json(sessions);
    }
    catch (error) {
        console.error('Get user sessions error:', error);
        res.status(500).json({ message: 'Error retrieving user sessions' });
    }
};
exports.getUserSessions = getUserSessions;
const revokeSession = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        await session_manager_1.SessionManager.revokeSession(refreshToken);
        res.json({ message: 'Session revoked successfully' });
    }
    catch (error) {
        console.error('Revoke session error:', error);
        res.status(500).json({ message: 'Error revoking session' });
    }
};
exports.revokeSession = revokeSession;
const revokeAllSessions = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        await session_manager_1.SessionManager.revokeAllUserSessions(req.user.userId);
        res.json({ message: 'All sessions revoked successfully' });
    }
    catch (error) {
        console.error('Revoke all sessions error:', error);
        res.status(500).json({ message: 'Error revoking sessions' });
    }
};
exports.revokeAllSessions = revokeAllSessions;
// Admin-only endpoints
const getSecurityEvents = async (req, res) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== prisma_1.Role.ADMIN) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { action, userId, ipAddress, startDate, endDate, limit } = req.query;
        const events = await audit_logger_1.AuditLogger.getSecurityEvents({
            action: action,
            userId: userId,
            ipAddress: ipAddress,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
        res.json(events);
    }
    catch (error) {
        console.error('Get security events error:', error);
        res.status(500).json({ message: 'Error retrieving security events' });
    }
};
exports.getSecurityEvents = getSecurityEvents;
