import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ContextMenu from '../ui/ContextMenu';
import ToastViewport from '../ui/ToastViewport';
import { useSettingsStore } from '../../store/useSettingsStore.js';

export default function AppLayout() {
    const { fontSize } = useSettingsStore();

    // Aplikowanie wielkości fonta globalnie
    useEffect(() => {
        const sizeMap = { 'Small': '11px', 'Medium': '13px', 'Large': '15px' };
        document.documentElement.style.setProperty('--global-mono-size', sizeMap[fontSize]);
    }, [fontSize]);

    return (
        <div className="flex h-screen w-full bg-[#0e0e0e] text-gray-200 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
            <ContextMenu />
            <ToastViewport />
        </div>
    );
}