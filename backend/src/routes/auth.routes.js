"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var auth_1 = require("../middleware/auth");
var validate_1 = require("../middleware/validate");
var auth_schema_1 = require("../schemas/auth.schema");
var rate_limiter_1 = require("../middleware/rate-limiter");
var router = (0, express_1.Router)();
// Public routes
router.post('/login', rate_limiter_1.authLimiter, (0, validate_1.validateRequest)(auth_schema_1.loginSchema), auth_controller_1.login);
// Protected routes
router.post('/refresh', auth_1.authenticate, (0, validate_1.validateRequest)(auth_schema_1.refreshTokenSchema), auth_controller_1.refresh);
router.post('/logout', auth_1.authenticate, auth_controller_1.logout);
exports.default = router;
