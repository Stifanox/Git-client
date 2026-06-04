import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore.js';

function ProfileLoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-surface text-on-surface-variant">
            <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={1.75} />
        </div>
    );
}

export default function OnboardingGate() {
    const profileStatus = useSettingsStore((s) => s.profileStatus);
    const { pathname } = useLocation();
    const onOnboarding = pathname === '/onboarding';

    if (profileStatus === 'idle' || profileStatus === 'loading') {
        return <ProfileLoadingScreen />;
    }

    if ((profileStatus === 'missing' || profileStatus === 'error') && !onOnboarding) {
        return <Navigate to="/onboarding" replace />;
    }

    if (profileStatus === 'ready' && onOnboarding) {
        return <Navigate to="/settings" replace />;
    }

    return <Outlet />;
}
