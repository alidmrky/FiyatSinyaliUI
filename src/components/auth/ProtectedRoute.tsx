import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

/**
 * ProtectedRoute - Protects routes that require authentication
 * @param children - Child components to render if authenticated
 * @param requireAdmin - If true, requires admin role
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Requires admin but user is not admin
    if (requireAdmin && !user?.roles?.includes('Admin')) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
