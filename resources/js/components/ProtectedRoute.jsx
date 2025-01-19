import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';
import { AdminLayoutSkeleton } from '@components/ui/Skeletons';

export default function ProtectedRoute({ children, requiredPermissions = [] }) {
    const { isAuthenticated, loading, checkAuth, hasPermission } = useAuth();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            if (!isAuthenticated && localStorage.getItem('token')) {
                await checkAuth();
            }
            setIsChecking(false);
        };
        verifyAuth();
    }, [checkAuth, isAuthenticated]);

    if (loading || isChecking) {
        return <AdminLayoutSkeleton />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasRequiredPermissions = requiredPermissions.length === 0 ||
        requiredPermissions.every(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
        return <Navigate to="/404" replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredPermissions: PropTypes.arrayOf(PropTypes.string)
};

