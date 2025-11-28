"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = void 0;
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var jwt_1 = require("../utils/jwt");
var zod_1 = require("zod");
var account_lockout_1 = require("../services/account-lockout");
var prisma = new client_1.PrismaClient();
// Validation schemas
var loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
});
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, canLogin, lockoutTime, user, remainingAttempts, isValidPassword, remainingAttempts, accessToken, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = loginSchema.parse(req.body), username = _a.username, password = _a.password;
                return [4 /*yield*/, (0, account_lockout_1.checkLoginAttempts)(username)];
            case 1:
                canLogin = _b.sent();
                if (!canLogin) {
                    lockoutTime = (0, account_lockout_1.getAccountLockoutTime)(username);
                    return [2 /*return*/, res.status(429).json({
                            message: 'Account temporarily locked due to too many failed attempts',
                            lockedUntil: lockoutTime,
                        })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { username: username },
                    })];
            case 2:
                user = _b.sent();
                if (!user) {
                    remainingAttempts = (0, account_lockout_1.getRemainingAttempts)(username);
                    return [2 /*return*/, res.status(401).json({
                            message: 'Invalid credentials',
                            remainingAttempts: remainingAttempts,
                        })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 3:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    remainingAttempts = (0, account_lockout_1.getRemainingAttempts)(username);
                    return [2 /*return*/, res.status(401).json({
                            message: 'Invalid credentials',
                            remainingAttempts: remainingAttempts,
                        })];
                }
                // Reset login attempts on successful login
                (0, account_lockout_1.resetLoginAttempts)(username);
                accessToken = (0, jwt_1.generateToken)(user);
                refreshToken = (0, jwt_1.generateRefreshToken)(user);
                // Set HttpOnly cookie for refresh token
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    path: '/',
                });
                res.json({
                    accessToken: accessToken,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: 'Invalid input', errors: error_1.errors })];
                }
                console.error('Login error:', error_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var refresh = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, accessToken, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Authentication required' })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: req.user.userId },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'User not found' })];
                }
                accessToken = (0, jwt_1.generateToken)(user);
                res.json({ accessToken: accessToken });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Refresh token error:', error_2);
                res.status(401).json({ message: 'Invalid refresh token' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refresh = refresh;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
