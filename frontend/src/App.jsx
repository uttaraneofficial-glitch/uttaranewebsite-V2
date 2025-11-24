import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import CompaniesPage from './pages/CompaniesPage' // Add Companies page
import NgoPostsPage from './pages/NgoPostsPage' // Add NGO posts page
import AboutPage from './pages/AboutPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import TestAPI from './components/TestAPI'
import LoginPage from './pages/admin/LoginPage'
import AdminLayout from './components/admin/AdminLayout'
import MainLayout from './components/MainLayout'
import DashboardPage from './pages/admin/DashboardPage'
import CompaniesPageAdmin from './pages/admin/CompaniesPage'
import VideosPage from './pages/admin/VideosPage'
import NgoPostsPageAdmin from './pages/admin/NgoPostsPage'
import MkStudioPostsPage from './pages/admin/MkStudioPostsPage'
import AboutContentPage from './pages/admin/AboutPage'
import PrivacyPolicyAdminPage from './pages/admin/PrivacyPolicyPage'
import TermsOfServiceAdminPage from './pages/admin/TermsOfServicePage'
import ContactSettingsPage from './pages/admin/ContactSettingsPage'
import SettingsPage from './pages/admin/SettingsPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CandidatesPage from './pages/admin/CandidatesPage' // Add Candidates page
import MkStudioPage from './pages/MkStudioPage' // Add MK Studio page

// Wrapper component to provide key to CompanyDetailPage
const CompanyDetailWithKey = () => {
  const { slug } = useParams(); // Changed from id to slug to match the URL pattern
  return <CompanyDetailPage key={slug} />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/company" element={<CompaniesPage />} /> {/* Add all companies route */}
          <Route path="/company/:slug" element={<CompanyDetailWithKey />} /> {/* Changed from :id to :slug */}
          <Route path="/ngo" element={<NgoPostsPage />} /> {/* Add all NGO posts route */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          {/* Add additional routes for /privacy and /terms */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/mkstudio" element={<MkStudioPage />} /> {/* Add MK Studio page route */}
          <Route path="/test" element={<TestAPI />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="companies" element={<CompaniesPageAdmin />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="candidates" element={<CandidatesPage />} /> {/* Add Candidates route */}
          <Route path="ngo-posts" element={<NgoPostsPageAdmin />} />
          <Route path="mkstudio-posts" element={<MkStudioPostsPage />} />
          <Route path="about" element={<AboutContentPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyAdminPage />} />
          <Route path="terms-of-service" element={<TermsOfServiceAdminPage />} />
          <Route path="contact-settings" element={<ContactSettingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App