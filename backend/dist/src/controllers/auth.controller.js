"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const zod_1 = require("zod");
const account_lockout_1 = require("../services/account-lockout");
const prisma = new client_1.PrismaClient();
// Validation schemas
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
});
const login = async (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);
        // Check for account lockout
        const canLogin = await (0, account_lockout_1.checkLoginAttempts)(username);
        if (!canLogin) {
            const lockoutTime = (0, account_lockout_1.getAccountLockoutTime)(username);
            return res.status(429).json({
                message: 'Account temporarily locked due to too many failed attempts',
                lockedUntil: lockoutTime,
            });
        }
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            const remainingAttempts = (0, account_lockout_1.getRemainingAttempts)(username);
            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts,
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            const remainingAttempts = (0, account_lockout_1.getRemainingAttempts)(username);
            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts,
            });
        }
        // Reset login attempts on successful login
        (0, account_lockout_1.resetLoginAttempts)(username);
        // Generate tokens
        const accessToken = (0, jwt_1.generateToken)(user);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user);
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: 'Invalid input', errors: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const accessToken = (0, jwt_1.generateToken)(user);
        res.json({ accessToken });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.json({ message: 'Successfully logged out' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error during logout' });
    }
};
exports.logout = logout;
