"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const changePassword = async (req, res) => {
    var _a;
    try {
        const { currentPassword, newPassword } = zod_1.z
            .object({
            currentPassword: zod_1.z.string(),
            newPassword: zod_1.z.string().min(8),
        })
            .parse(req.body);
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        res.json({ message: 'Password successfully changed' });
    }
    catch (error) {
        console.error('Password change error:', error);
        res.status(400).json({ message: 'Invalid input' });
    }
};
exports.changePassword = changePassword;
