import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';

export default function AuthBootstrap() {
    const init = useAuthStore((s) => s.init);

    useEffect(() => {
        const unsubscribe = init();
        return unsubscribe;
    }, [init]);

    return null;
}
