import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public Pages
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import ForgotPasswordPage from '../pages/ForgotPassword';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Dashboard Pages (Lazy Loaded for performance)
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const PlansManagement = lazy(() => import('../features/admin/pages/PlansManagement'));
const CaseworkerManagement = lazy(() => import('../features/admin/pages/CaseworkerManagement'));
const SystemIntelligence = lazy(() => import('../features/admin/pages/SystemIntelligence'));

const CaseworkerDashboard = lazy(() => import('../features/caseworker/pages/CaseworkerDashboard'));
const Applications = lazy(() => import('../features/caseworker/pages/Applications'));
const Eligibility = lazy(() => import('../features/caseworker/pages/Eligibility'));
const BenefitDisbursement = lazy(() => import('../features/caseworker/pages/BenefitDisbursement'));
const ReviewHistory = lazy(() => import('../features/caseworker/pages/ReviewHistory'));
const CommunicationCenter = lazy(() => import('../features/caseworker/pages/CommunicationCenter'));

const CitizenDashboard = lazy(() => import('../features/citizen/pages/CitizenDashboard'));
const MyApplications = lazy(() => import('../features/citizen/pages/MyApplications'));
const Apply = lazy(() => import('../features/citizen/pages/Apply'));
const CitizenProfile = lazy(() => import('../features/citizen/pages/CitizenProfile'));

const NotificationInbox = lazy(() => import('../features/common/NotificationInbox'));
const SecuritySync = lazy(() => import('../features/citizen/pages/SecuritySync'));
const Preferences = lazy(() => import('../features/citizen/pages/Preferences'));

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-1 gap-1 flex">
             <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Unified Dashboard Shell */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          
          {/* ADMIN SPACE */}
          <Route path="/admin" element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="plans" element={<PlansManagement />} />
            <Route path="caseworkers" element={<CaseworkerManagement />} />
            <Route path="reports" element={<SystemIntelligence />} />
          </Route>

          {/* CASEWORKER SPACE */}
          <Route path="/caseworker" element={<RoleBasedRoute allowedRoles={['CASEWORKER']} />}>
            <Route index element={<Navigate to="/caseworker/dashboard" replace />} />
            <Route path="dashboard" element={<CaseworkerDashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="eligibility/:id" element={<Eligibility />} />
            <Route path="eligibility" element={<Eligibility />} />
            <Route path="history" element={<ReviewHistory />} />
            <Route path="messenger" element={<CommunicationCenter />} />
            <Route path="benefits" element={<BenefitDisbursement />} />
            <Route path="notifications" element={<NotificationInbox />} />
          </Route>

          {/* CITIZEN SPACE */}
          <Route path="/dashboard" element={<RoleBasedRoute allowedRoles={['CITIZEN']} />}>
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<CitizenDashboard />} />
            <Route path="apply" element={<Apply />} />
            <Route path="status" element={<MyApplications />} />
            <Route path="profile" element={<CitizenProfile />} />
            <Route path="security" element={<SecuritySync />} />
            <Route path="settings" element={<Preferences />} />
            <Route path="notifications" element={<NotificationInbox />} />
          </Route>

          <Route path="/unauthorized" element={
            <div className="p-12 text-center">
              <h1 className="text-4xl font-black text-red-500 mb-4">403</h1>
              <p className="text-neutral-400">You are not authorized to access this secure zone.</p>
            </div>
          } />
        </Route>

        {/* Global Root Redirect */}
        <Route path="/" element={
          user ? (
            <Navigate to={{
              'ADMIN': '/admin/dashboard',
              'CASEWORKER': '/caseworker/dashboard',
              'CITIZEN': '/dashboard/home'
            }[user.role] || '/login'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;


