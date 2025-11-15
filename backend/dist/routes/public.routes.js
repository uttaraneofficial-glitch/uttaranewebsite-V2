"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companies_controller_1 = require("../controllers/public/companies.controller");
const content_controller_1 = require("../controllers/public/content.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/companies', companies_controller_1.getPublicCompanies);
router.get('/companies/:slug', companies_controller_1.getPublicCompanyBySlug);
// Content routes
router.get('/about', content_controller_1.getAboutContent);
router.get('/hero', content_controller_1.getHeroContent);
router.get('/ngo-posts', content_controller_1.getNgoPosts);
router.get('/mkstudio-posts', content_controller_1.getMkStudioPosts);
router.get('/mkstudio-latest', content_controller_1.getLatestMkStudioVideo);
exports.default = router;
