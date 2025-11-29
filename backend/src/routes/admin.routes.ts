import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '../types/prisma';
import { upload } from '../middleware/upload';
import {
  getAdminCompanies,
  getAdminCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/admin/companies.controller';
import {
  getAdminVideos,
  getAdminVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/admin/videos.controller';
import {
  getAdminNgoPosts,
  getAdminNgoPostById,
  createNgoPost,
  updateNgoPost,
  deleteNgoPost,
} from '../controllers/admin/ngo-posts.controller';
import {
  getAdminMkStudioPosts,
  getAdminMkStudioPostById,
  createMkStudioPost,
  updateMkStudioPost,
  deleteMkStudioPost,
} from '../controllers/admin/mkstudio-posts.controller';
import {
  getSiteContent,
  updateSiteContent,
} from '../controllers/admin/site-content.controller';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} from '../controllers/admin/users.controller';
import {
  getAdminCandidates,
  getAdminCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/admin/candidates.controller';

import {
  getDashboardStats,
  getGlobalSearch,
  getNotifications,
  getDashboardCharts,
} from '../controllers/dashboard.controller';

import { uploadImage } from '../controllers/admin/upload.controller';

const router = Router();

// Apply authentication middleware to all admin routes
router.use(authenticate, requireRole([Role.ADMIN]));

// Generic Image Upload Route
router.post('/upload-image', upload.single('image'), uploadImage);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/search', getGlobalSearch);
router.get('/dashboard/charts', getDashboardCharts);
router.get('/dashboard/notifications', getNotifications);

// Company management routes
router.get('/companies', getAdminCompanies);
router.get('/companies/:id', getAdminCompanyById);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

// Video management routes
router.get('/videos', getAdminVideos);
router.get('/videos/:id', getAdminVideoById);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

// Candidate management routes
router.get('/candidates', getAdminCandidates);
router.get('/candidates/:id', getAdminCandidateById);
router.post('/candidates', createCandidate);
router.put('/candidates/:id', updateCandidate);
router.delete('/candidates/:id', deleteCandidate);

// NGO Post management routes
router.get('/ngo-posts', getAdminNgoPosts);
router.get('/ngo-posts/:id', getAdminNgoPostById);
router.post('/ngo-posts', createNgoPost);
router.put('/ngo-posts/:id', updateNgoPost);
router.delete('/ngo-posts/:id', deleteNgoPost);

// MK Studio Post management routes
router.get('/mkstudio-posts', getAdminMkStudioPosts);
router.get('/mkstudio-posts/:id', getAdminMkStudioPostById);
router.post('/mkstudio-posts', createMkStudioPost);
router.put('/mkstudio-posts/:id', updateMkStudioPost);
router.delete('/mkstudio-posts/:id', deleteMkStudioPost);

// Site Content management routes
router.get('/site-content/:key', getSiteContent);
router.put('/site-content/:key', updateSiteContent);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/password', changeUserPassword);

export default router;
