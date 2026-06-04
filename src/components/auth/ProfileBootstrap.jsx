import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';

export default function ProfileBootstrap() {
    const uid = useAuthStore((s) => s.user?.uid);
    const email = useAuthStore((s) => s.user?.email ?? '');

    useEffect(() => {
        const { loadProfile, resetProfile } = useSettingsStore.getState();

        if (!uid) {
            resetProfile();
            return;
        }

        loadProfile(uid, email);
    }, [uid, email]);

    return null;
}
