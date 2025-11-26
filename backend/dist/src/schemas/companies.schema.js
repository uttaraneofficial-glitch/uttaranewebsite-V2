"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
exports.createCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Company name is required')
            .max(100, 'Company name must be less than 100 characters'),
        description: zod_1.z
            .string()
            .max(500, 'Description must be less than 500 characters')
            .optional(),
        bannerUrl: zod_1.z.string().optional(),
    }),
});
exports.updateCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Company name is required')
            .max(100, 'Company name must be less than 100 characters')
            .optional(),
        description: zod_1.z
            .string()
            .max(500, 'Description must be less than 500 characters')
            .optional(),
        bannerUrl: zod_1.z.string().optional(),
    }),
});
