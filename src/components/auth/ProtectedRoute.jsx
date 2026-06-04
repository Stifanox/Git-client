import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import ProfileBootstrap from './ProfileBootstrap.jsx';

function AuthLoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-surface text-on-surface-variant">
            <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={1.75} />
        </div>
    );
}

export default function ProtectedRoute() {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <AuthLoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return (
        <>
            <ProfileBootstrap />
            <Outlet />
        </>
    );
}
