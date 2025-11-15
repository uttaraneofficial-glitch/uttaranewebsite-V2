"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companies_controller_1 = require("../controllers/companies.controller");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../types/prisma");
const validate_1 = require("../middleware/validate");
const companies_schema_1 = require("../schemas/companies.schema");
const router = (0, express_1.Router)();
// Public routes
router.get('/', companies_controller_1.getCompanies);
router.get('/:id', companies_controller_1.getCompanyById);
// Admin-only routes
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), (0, validate_1.validateRequest)(companies_schema_1.createCompanySchema), companies_controller_1.createCompany);
router.put('/:id', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), (0, validate_1.validateRequest)(companies_schema_1.updateCompanySchema), companies_controller_1.updateCompany);
router.delete('/:id', auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]), companies_controller_1.deleteCompany);
exports.default = router;
