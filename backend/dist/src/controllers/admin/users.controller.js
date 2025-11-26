"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPassword = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8).optional(),
    role: zod_1.z.enum(['ADMIN', 'USER']).optional(),
});
const passwordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8),
});
// Get all users (admin)
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            data: users,
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};
exports.getUsers = getUsers;
// Get user by ID (admin)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ data: user });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Error retrieving user' });
    }
};
exports.getUserById = getUserById;
// Create user (admin)
const createUser = async (req, res) => {
    try {
        const userData = userSchema.parse(req.body);
        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: userData.username },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Hash password if provided
        let hashedPassword = '';
        if (userData.password) {
            hashedPassword = await bcrypt.hash(userData.password, 12);
        }
        const user = await prisma.user.create({
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
        });
        res.status(201).json({
            message: 'User created successfully',
            data: user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
exports.createUser = createUser;
// Update user (admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = userSchema.parse(req.body);
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if username is being changed and if it already exists
        if (userData.username && userData.username !== existingUser.username) {
            const userWithSameUsername = await prisma.user.findUnique({
                where: { username: userData.username },
            });
            if (userWithSameUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }
        // Prepare update data
        const updateData = {
            username: userData.username,
            role: userData.role,
        };
        // Hash password if provided
        if (userData.password) {
            updateData.password = await bcrypt.hash(userData.password, 12);
        }
        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json({
            message: 'User updated successfully',
            data: user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
// Delete user (admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Prevent deleting the main admin user
        if (existingUser.username === process.env.ADMIN_USERNAME ||
            existingUser.role === 'ADMIN') {
            // Check if this is the only admin user
            const adminUsers = await prisma.user.count({
                where: { role: 'ADMIN' },
            });
            if (adminUsers <= 1) {
                return res
                    .status(400)
                    .json({ message: 'Cannot delete the last admin user' });
            }
        }
        // Delete the user
        await prisma.user.delete({
            where: { id },
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
// Change user password (admin)
const changeUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const passwordData = passwordSchema.parse(req.body);
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(passwordData.password, 12);
        // Update the password
        await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
            },
        });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};
exports.changeUserPassword = changeUserPassword;
