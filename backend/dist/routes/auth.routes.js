"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auth_schema_1 = require("../schemas/auth.schema");
const rate_limiter_1 = require("../middleware/rate-limiter");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', rate_limiter_1.authLimiter, (0, validate_1.validateRequest)(auth_schema_1.loginSchema), auth_controller_1.login);
// Protected routes
router.post('/refresh', auth_1.authenticate, (0, validate_1.validateRequest)(auth_schema_1.refreshTokenSchema), auth_controller_1.refresh);
router.post('/logout', auth_1.authenticate, auth_controller_1.logout);
exports.default = router;
