import { NavLink, useNavigate } from 'react-router-dom';
import { Database, GitBranch, History, List, Settings, HelpCircle, SquareTerminal, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useTerminalStore } from '../../store/useTerminalStore.js';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const terminalOpen = useTerminalStore((s) => s.isOpen);
    const toggleTerminal = useTerminalStore((s) => s.toggle);

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };
    const topNavItems = [
        { icon: Database, label: 'Repositories', path: '/repositories' },
        { icon: GitBranch, label: 'Branches', path: '/branches' },
        { icon: History, label: 'History', path: '/history' },
        { icon: List, label: 'Staging', path: '/staging' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const bottomNavItems = [
        { icon: HelpCircle, label: 'Documentation', path: '/docs', type: 'link' },
        { icon: SquareTerminal, label: 'Terminal', type: 'terminal' },
    ];

    // Wspólne klasy dla linków
    const linkBaseClasses = "flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 w-full";
    const linkInactiveClasses = "text-[#8a8a8a] hover:text-gray-200 hover:bg-white/[0.03]";
    const linkActiveClasses = "bg-[#252626] text-[#adc6ff]";

    return (
        <aside className="w-[260px] bg-[#131313] h-screen flex flex-col shrink-0">
            {/* Logo Section */}
            <div className="px-6 pt-8 pb-8">
                <h1 className="text-[22px] font-extrabold text-white tracking-tight leading-none">
                    The Monolithic
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] mt-2">
                    Local Git Client
                </p>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {topNavItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`
                        }
                    >
                        <item.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {user && (
                <div className="px-6 pb-4">
                    <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant font-body">
                        Signed in as
                    </p>
                    <p className="mt-1 truncate text-[13px] font-medium text-on-surface font-body" title={user.email ?? ''}>
                        {user.email}
                    </p>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`${linkBaseClasses} ${linkInactiveClasses} mt-3`}
                    >
                        <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
                        Sign Out
                    </button>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="px-3 pb-6 space-y-1 mt-auto">
                {bottomNavItems.map((item) =>
                    item.type === 'terminal' ? (
                        <button
                            key={item.label}
                            type="button"
                            onClick={toggleTerminal}
                            className={`${linkBaseClasses} ${terminalOpen ? linkActiveClasses : linkInactiveClasses}`}
                        >
                            <item.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                            {item.label}
                        </button>
                    ) : (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) =>
                                `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`
                            }
                        >
                            <item.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                            {item.label}
                        </NavLink>
                    )
                )}
            </div>
        </aside>
    );
}