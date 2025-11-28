"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoSchema = exports.createVideoSchema = void 0;
var zod_1 = require("zod");
exports.createVideoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, 'Title is required')
            .max(200, 'Title must be less than 200 characters'),
        description: zod_1.z
            .string()
            .max(1000, 'Description must be less than 1000 characters')
            .optional(),
        url: zod_1.z.string().url('Must be a valid URL'),
        thumbnailUrl: zod_1.z.string().url('Must be a valid URL').optional(),
        duration: zod_1.z.number().positive('Duration must be positive').optional(),
        isPublished: zod_1.z.boolean().optional().default(false),
    }),
});
exports.updateVideoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, 'Title is required')
            .max(200, 'Title must be less than 200 characters')
            .optional(),
        description: zod_1.z
            .string()
            .max(1000, 'Description must be less than 1000 characters')
            .optional(),
        url: zod_1.z.string().url('Must be a valid URL').optional(),
        thumbnailUrl: zod_1.z.string().url('Must be a valid URL').optional(),
        duration: zod_1.z.number().positive('Duration must be positive').optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
