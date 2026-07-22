import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * A small route guard that centralizes auth-based navigation.
 *
 * - When requireAuth is true, unauthenticated users are redirected to the sign-in page.
 * - When requireAuth is false, authenticated users are redirected away from guest pages
 *   like sign-in and sign-up so they do not see login screens repeatedly.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="rounded-full border border-(--border) bg-(--surface) px-5 py-3 text-sm text-(--muted)">
          Checking session...
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
