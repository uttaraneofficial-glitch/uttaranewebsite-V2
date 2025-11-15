"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_controller_1 = require("../controllers/password.controller");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const password_schema_1 = require("../schemas/password.schema");
const rate_limiter_1 = require("../middleware/rate-limiter");
const router = (0, express_1.Router)();
// Public routes with rate limiting
router.post('/forgot-password', rate_limiter_1.authLimiter, (0, validate_1.validateRequest)(password_schema_1.passwordResetRequestSchema), password_controller_1.requestPasswordReset);
router.post('/reset-password', rate_limiter_1.authLimiter, (0, validate_1.validateRequest)(password_schema_1.passwordResetSchema), password_controller_1.resetPassword);
// Protected routes
router.post('/change-password', auth_1.authenticate, (0, validate_1.validateRequest)(password_schema_1.changePasswordSchema), user_controller_1.changePassword);
exports.default = router;
