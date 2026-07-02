import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import OtpPage from './pages/auth/OtpPage';
import DashboardPage from './pages/tabs/DashboardPage';
import PartiesPage from './pages/tabs/PartiesPage';
import TransactionsPage from './pages/tabs/TransactionsPage';
import CreateOrganizationPage from './pages/main/CreateOrganizationPage';
import Layout from './components/common/Layout';

import { Toaster } from './components/ui/sonner';

export default function AppRoutes() {
  const { isAuthenticated, selectedOrganization } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />

        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !selectedOrganization ? (
              // Authenticated but no organization on record -- send them to create
              // one instead of rendering a dashboard with no tenant context.
              <Navigate to="/create-organization" />
            ) : (
              <Layout />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="parties" element={<PartiesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>

        <Route
          path="/create-organization"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : selectedOrganization ? (
              // Already has an organization -- never let a returning user land
              // here and accidentally create a duplicate one.
              <Navigate to="/dashboard" />
            ) : (
              <CreateOrganizationPage />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}