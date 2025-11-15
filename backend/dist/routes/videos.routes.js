"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videos_controller_1 = require("../controllers/videos.controller");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../types/prisma");
const validate_1 = require("../middleware/validate");
const videos_schema_1 = require("../schemas/videos.schema");
const router = (0, express_1.Router)();
// Public routes
router.get('/', videos_controller_1.getVideos);
router.get('/:id', videos_controller_1.getVideoById);
// Admin-only routes
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), (0, validate_1.validateRequest)(videos_schema_1.createVideoSchema), videos_controller_1.createVideo);
router.put('/:id', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), (0, validate_1.validateRequest)(videos_schema_1.updateVideoSchema), videos_controller_1.updateVideo);
router.delete('/:id', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), videos_controller_1.deleteVideo);
router.patch('/:id/publish', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), videos_controller_1.togglePublishVideo);
exports.default = router;
