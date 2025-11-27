import React, { Suspense, lazy } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Lazy load components
const Homepage = lazy(() => import('./pages/Homepage'));
const CompanyDetailPage = lazy(() => import('./pages/CompanyDetailPage'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'));
const NgoPostsPage = lazy(() => import('./pages/NgoPostsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TestAPI = lazy(() => import('./components/TestAPI'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const CompaniesPageAdmin = lazy(() => import('./pages/admin/CompaniesPage'));
const VideosPage = lazy(() => import('./pages/admin/VideosPage'));
const NgoPostsPageAdmin = lazy(() => import('./pages/admin/NgoPostsPage'));
const MkStudioPostsPage = lazy(() => import('./pages/admin/MkStudioPostsPage'));
const AboutContentPage = lazy(() => import('./pages/admin/AboutPage'));
const PrivacyPolicyAdminPage = lazy(() => import('./pages/admin/PrivacyPolicyPage'));
const TermsOfServiceAdminPage = lazy(() => import('./pages/admin/TermsOfServicePage'));
const ContactSettingsPage = lazy(() => import('./pages/admin/ContactSettingsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const CandidatesPage = lazy(() => import('./pages/admin/CandidatesPage'));
const MkStudioPage = lazy(() => import('./pages/MkStudioPage'));
const SearchResultsPage = lazy(() => import('./pages/admin/SearchResultsPage'));
const SoftwareDevelopment = lazy(() => import('./pages/SoftwareDevelopment'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Wrapper component to provide key to CompanyDetailPage
const CompanyDetailWithKey = () => {
  const { slug } = useParams();
  return <CompanyDetailPage key={slug} />;
};

function App() {
  return (
    <div className="App">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/company" element={<CompaniesPage />} />
            <Route path="/company/software-development" element={<SoftwareDevelopment />} />
            <Route path="/company/:slug" element={<CompanyDetailWithKey />} />
            <Route path="/ngo" element={<NgoPostsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/mkstudio" element={<MkStudioPage />} />
            <Route path="/test" element={<TestAPI />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="companies" element={<CompaniesPageAdmin />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="ngo-posts" element={<NgoPostsPageAdmin />} />
            <Route path="mkstudio-posts" element={<MkStudioPostsPage />} />
            <Route path="about" element={<AboutContentPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyAdminPage />} />
            <Route
              path="terms-of-service"
              element={<TermsOfServiceAdminPage />}
            />
            <Route path="contact-settings" element={<ContactSettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
