"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../types/prisma");
const security_controller_1 = require("../controllers/security.controller");
const router = (0, express_1.Router)();
// User security routes
router.get('/activity', auth_1.authenticate, security_controller_1.getUserActivity);
router.get('/sessions', auth_1.authenticate, security_controller_1.getUserSessions);
router.post('/sessions/revoke', auth_1.authenticate, security_controller_1.revokeSession);
router.post('/sessions/revoke-all', auth_1.authenticate, security_controller_1.revokeAllSessions);
// Admin-only routes
router.get('/events', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), security_controller_1.getSecurityEvents);
exports.default = router;
