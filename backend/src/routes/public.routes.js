"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var companies_controller_1 = require("../controllers/public/companies.controller");
var content_controller_1 = require("../controllers/public/content.controller");
var contact_controller_1 = require("../controllers/public/contact.controller");
var router = (0, express_1.Router)();
// Public routes
router.get('/companies', companies_controller_1.getPublicCompanies);
router.get('/companies/:slug', companies_controller_1.getPublicCompanyBySlug);
router.get('/companies/:slug/videos', companies_controller_1.getCompanyVideosBySlug);
router.get('/candidates', companies_controller_1.getPublicCandidates);
// Content routes
router.get('/about', content_controller_1.getAboutContent);
router.get('/hero', content_controller_1.getHeroContent);
router.get('/privacy-policy', content_controller_1.getPrivacyPolicyContent);
router.get('/terms-of-service', content_controller_1.getTermsOfServiceContent);
router.get('/ngo-posts', content_controller_1.getNgoPosts);
router.get('/mkstudio-posts', content_controller_1.getMkStudioPosts);
router.get('/mkstudio-latest', content_controller_1.getLatestMkStudioVideo);
router.get('/instructor', content_controller_1.getInstructorContent);
// Contact form route
router.post('/contact', contact_controller_1.submitContactForm);
exports.default = router;
