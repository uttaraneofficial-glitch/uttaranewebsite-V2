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
exports.changeUserPassword = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
// Validation schemas
var userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8).optional(),
    role: zod_1.z.enum(['ADMIN', 'USER']).optional(),
});
var passwordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8),
});
// Get all users (admin)
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findMany({
                        select: {
                            id: true,
                            username: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            case 1:
                users = _a.sent();
                res.json({
                    data: users,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get users error:', error_1);
                res.status(500).json({ message: 'Error retrieving users' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
// Get user by ID (admin)
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: id },
                        select: {
                            id: true,
                            username: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                res.json({ data: user });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get user error:', error_2);
                res.status(500).json({ message: 'Error retrieving user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
// Create user (admin)
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, existingUser, hashedPassword, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                userData = userSchema.parse(req.body);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { username: userData.username },
                    })];
            case 1:
                existingUser = _a.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: 'Username already exists' })];
                }
                hashedPassword = '';
                if (!userData.password) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.hash(userData.password, 12)];
            case 2:
                hashedPassword = _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, prisma.user.create({
                    data: {
                        username: userData.username,
                        password: hashedPassword,
                        role: userData.role || 'USER',
                    },
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                })];
            case 4:
                user = _a.sent();
                res.status(201).json({
                    message: 'User created successfully',
                    data: user,
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_3.errors,
                        })];
                }
                console.error('Create user error:', error_3);
                res.status(500).json({ message: 'Error creating user' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
// Update user (admin)
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userData, existingUser, userWithSameUsername, updateData, _a, user, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                id = req.params.id;
                userData = userSchema.parse(req.body);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                if (!(userData.username && userData.username !== existingUser.username)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { username: userData.username },
                    })];
            case 2:
                userWithSameUsername = _b.sent();
                if (userWithSameUsername) {
                    return [2 /*return*/, res.status(400).json({ message: 'Username already exists' })];
                }
                _b.label = 3;
            case 3:
                updateData = {
                    username: userData.username,
                    role: userData.role,
                };
                if (!userData.password) return [3 /*break*/, 5];
                _a = updateData;
                return [4 /*yield*/, bcrypt.hash(userData.password, 12)];
            case 4:
                _a.password = _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, prisma.user.update({
                    where: { id: id },
                    data: updateData,
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                })];
            case 6:
                user = _b.sent();
                res.json({
                    message: 'User updated successfully',
                    data: user,
                });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _b.sent();
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_4.errors,
                        })];
                }
                console.error('Update user error:', error_4);
                res.status(500).json({ message: 'Error updating user' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
// Delete user (admin)
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingUser, adminUsers, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                if (!(existingUser.username === process.env.ADMIN_USERNAME ||
                    existingUser.role === 'ADMIN')) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.user.count({
                        where: { role: 'ADMIN' },
                    })];
            case 2:
                adminUsers = _a.sent();
                if (adminUsers <= 1) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: 'Cannot delete the last admin user' })];
                }
                _a.label = 3;
            case 3: 
            // Delete the user
            return [4 /*yield*/, prisma.user.delete({
                    where: { id: id },
                })];
            case 4:
                // Delete the user
                _a.sent();
                res.json({ message: 'User deleted successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Delete user error:', error_5);
                res.status(500).json({ message: 'Error deleting user' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
// Change user password (admin)
var changeUserPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, passwordData, existingUser, hashedPassword, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                passwordData = passwordSchema.parse(req.body);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [4 /*yield*/, bcrypt.hash(passwordData.password, 12)];
            case 2:
                hashedPassword = _a.sent();
                // Update the password
                return [4 /*yield*/, prisma.user.update({
                        where: { id: id },
                        data: {
                            password: hashedPassword,
                        },
                    })];
            case 3:
                // Update the password
                _a.sent();
                res.json({ message: 'Password changed successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                if (error_6 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_6.errors,
                        })];
                }
                console.error('Change password error:', error_6);
                res.status(500).json({ message: 'Error changing password' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changeUserPassword = changeUserPassword;
