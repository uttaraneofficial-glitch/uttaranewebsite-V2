"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var prisma_1 = require("../types/prisma");
var upload_1 = require("../middleware/upload");
var companies_controller_1 = require("../controllers/admin/companies.controller");
var videos_controller_1 = require("../controllers/admin/videos.controller");
var ngo_posts_controller_1 = require("../controllers/admin/ngo-posts.controller");
var mkstudio_posts_controller_1 = require("../controllers/admin/mkstudio-posts.controller");
var site_content_controller_1 = require("../controllers/admin/site-content.controller");
var users_controller_1 = require("../controllers/admin/users.controller");
var candidates_controller_1 = require("../controllers/admin/candidates.controller");
var dashboard_controller_1 = require("../controllers/dashboard.controller");
var upload_controller_1 = require("../controllers/admin/upload.controller");
var router = (0, express_1.Router)();
// Apply authentication middleware to all admin routes
router.use(auth_1.authenticate, (0, auth_1.requireRole)([prisma_1.Role.ADMIN]));

// Generic Image Upload Route
router.post('/upload-image', upload_1.upload.single('image'), upload_controller_1.uploadImage);

// Dashboard routes
router.get('/dashboard/stats', dashboard_controller_1.getDashboardStats);
router.get('/dashboard/search', dashboard_controller_1.getGlobalSearch);
router.get('/dashboard/charts', dashboard_controller_1.getDashboardCharts);
router.get('/dashboard/notifications', dashboard_controller_1.getNotifications);
// Company management routes
router.get('/companies', companies_controller_1.getAdminCompanies);
router.get('/companies/:id', companies_controller_1.getAdminCompanyById);
router.post('/companies', companies_controller_1.createCompany);
router.put('/companies/:id', companies_controller_1.updateCompany);
router.delete('/companies/:id', companies_controller_1.deleteCompany);
// Video management routes
router.get('/videos', videos_controller_1.getAdminVideos);
router.get('/videos/:id', videos_controller_1.getAdminVideoById);
router.post('/videos', videos_controller_1.createVideo);
router.put('/videos/:id', videos_controller_1.updateVideo);
router.delete('/videos/:id', videos_controller_1.deleteVideo);
// Candidate management routes
router.get('/candidates', candidates_controller_1.getAdminCandidates);
router.get('/candidates/:id', candidates_controller_1.getAdminCandidateById);
router.post('/candidates', candidates_controller_1.createCandidate);
router.put('/candidates/:id', candidates_controller_1.updateCandidate);
router.delete('/candidates/:id', candidates_controller_1.deleteCandidate);
// NGO Post management routes
router.get('/ngo-posts', ngo_posts_controller_1.getAdminNgoPosts);
router.get('/ngo-posts/:id', ngo_posts_controller_1.getAdminNgoPostById);
router.post('/ngo-posts', ngo_posts_controller_1.createNgoPost);
router.put('/ngo-posts/:id', ngo_posts_controller_1.updateNgoPost);
router.delete('/ngo-posts/:id', ngo_posts_controller_1.deleteNgoPost);
// MK Studio Post management routes
router.get('/mkstudio-posts', mkstudio_posts_controller_1.getAdminMkStudioPosts);
router.get('/mkstudio-posts/:id', mkstudio_posts_controller_1.getAdminMkStudioPostById);
router.post('/mkstudio-posts', mkstudio_posts_controller_1.createMkStudioPost);
router.put('/mkstudio-posts/:id', mkstudio_posts_controller_1.updateMkStudioPost);
router.delete('/mkstudio-posts/:id', mkstudio_posts_controller_1.deleteMkStudioPost);
// Site Content management routes
router.get('/site-content/:key', site_content_controller_1.getSiteContent);
router.put('/site-content/:key', site_content_controller_1.updateSiteContent);
// User management routes
router.get('/users', users_controller_1.getUsers);
router.get('/users/:id', users_controller_1.getUserById);
router.post('/users', users_controller_1.createUser);
router.put('/users/:id', users_controller_1.updateUser);
router.delete('/users/:id', users_controller_1.deleteUser);
router.put('/users/:id/password', users_controller_1.changeUserPassword);
exports.default = router;
