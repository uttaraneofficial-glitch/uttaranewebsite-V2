import { Router } from 'express';
import {
  getPublicCompanies,
  getPublicCompanyBySlug,
  getCompanyVideosBySlug,
} from '../controllers/public/companies.controller';
import {
  getAboutContent,
  getHeroContent,
  getNgoPosts,
  getMkStudioPosts,
  getLatestMkStudioVideo,
} from '../controllers/public/content.controller';

const router = Router();

// Public routes
router.get('/companies', getPublicCompanies);
router.get('/companies/:slug', getPublicCompanyBySlug);
router.get('/companies/:slug/videos', getCompanyVideosBySlug);

// Content routes
router.get('/about', getAboutContent);
router.get('/hero', getHeroContent);
router.get('/ngo-posts', getNgoPosts);
router.get('/mkstudio-posts', getMkStudioPosts);
router.get('/mkstudio-latest', getLatestMkStudioVideo);

export default router;
