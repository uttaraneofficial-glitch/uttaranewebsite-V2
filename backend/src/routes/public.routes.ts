import { Router } from 'express';
import {
  getPublicCompanies,
  getPublicCompanyBySlug,
  getCompanyVideosBySlug,
  getPublicCandidates,
} from '../controllers/public/companies.controller';
import {
  getAboutContent,
  getHeroContent,
  getPrivacyPolicyContent,
  getTermsOfServiceContent,
  getNgoPosts,
  getMkStudioPosts,
  getLatestMkStudioVideo,
  getInstructorContent,
} from '../controllers/public/content.controller';
import { submitContactForm } from '../controllers/public/contact.controller';

const router = Router();

// Public routes
router.get('/companies', getPublicCompanies);
router.get('/companies/:slug', getPublicCompanyBySlug);
router.get('/companies/:slug/videos', getCompanyVideosBySlug);
router.get('/candidates', getPublicCandidates);

// Content routes
router.get('/about', getAboutContent);
router.get('/hero', getHeroContent);
router.get('/privacy-policy', getPrivacyPolicyContent);
router.get('/terms-of-service', getTermsOfServiceContent);
router.get('/ngo-posts', getNgoPosts);
router.get('/mkstudio-posts', getMkStudioPosts);
router.get('/mkstudio-latest', getLatestMkStudioVideo);
router.get('/instructor', getInstructorContent);

// Contact form route
router.post('/contact', submitContactForm);

export default router;
