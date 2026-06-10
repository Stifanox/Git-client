import { create } from 'zustand';

const MOCK_DIFF_APP = [
    { type: 'context', content: 'import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";' },
    { type: 'context', content: 'import AppLayout from "./components/layout/AppLayout";' },
    { type: 'context', content: '' },
    { type: 'removed', content: 'import AuthBootstrap from "./components/auth/AuthBootstrap.jsx";' },
    { type: 'removed', content: 'import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";' },
    { type: 'added',   content: 'import StagingPage from "./components/pages/StagingPage.jsx";' },
    { type: 'added',   content: 'import BranchesPage from "./components/pages/BranchesPage.jsx";' },
    { type: 'context', content: 'import SettingsPage from "./components/pages/SettingsPage.jsx";' },
    { type: 'context', content: '' },
    { type: 'context', content: 'export default function App() {' },
    { type: 'context', content: '    return (' },
    { type: 'context', content: '        <BrowserRouter>' },
    { type: 'removed', content: '            <AuthBootstrap />' },
    { type: 'context', content: '            <Routes>' },
    { type: 'removed', content: '                <Route element={<ProtectedRoute />}>' },
    { type: 'added',   content: '                <Route element={<AppLayout />}>' },
    { type: 'context', content: '                    <Route path="/settings" element={<SettingsPage />} />' },
    { type: 'added',   content: '                    <Route path="/staging"  element={<StagingPage />} />' },
    { type: 'added',   content: '                    <Route path="/branches" element={<BranchesPage />} />' },
    { type: 'context', content: '                </Route>' },
    { type: 'context', content: '            </Routes>' },
    { type: 'context', content: '        </BrowserRouter>' },
    { type: 'context', content: '    );' },
    { type: 'context', content: '}' },
];

const MOCK_DIFF_SIDEBAR = [
    { type: 'context', content: 'import { NavLink } from "react-router-dom";' },
    { type: 'removed', content: 'import { ..., LogOut } from "lucide-react";' },
    { type: 'added',   content: 'import { Database, GitBranch, History, List, Settings } from "lucide-react";' },
    { type: 'context', content: '' },
    { type: 'removed', content: 'import { useAuthStore } from "../../store/useAuthStore.js";' },
    { type: 'context', content: '' },
    { type: 'context', content: 'export default function Sidebar() {' },
    { type: 'removed', content: '    const { user, logout } = useAuthStore();' },
    { type: 'context', content: '    const topNavItems = [' },
    { type: 'context', content: '        { icon: Database,  label: "Repositories", path: "/repositories" },' },
    { type: 'added',   content: '        { icon: GitBranch, label: "Branches",     path: "/branches" },' },
    { type: 'added',   content: '        { icon: List,      label: "Staging",      path: "/staging" },' },
    { type: 'context', content: '        { icon: Settings,  label: "Settings",     path: "/settings" },' },
    { type: 'context', content: '    ];' },
];

const MOCK_DIFF_DELETED = [
    { type: 'removed', content: 'import ReactGA from "react-ga4";' },
    { type: 'removed', content: 'import Hotjar from "@hotjar/browser";' },
    { type: 'removed', content: '' },
    { type: 'removed', content: 'export function initAnalytics() {' },
    { type: 'removed', content: '    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {' },
    { type: 'removed', content: '        ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);' },
    { type: 'removed', content: '    }' },
    { type: 'removed', content: '    if (import.meta.env.VITE_HOTJAR_SITE_ID) {' },
    { type: 'removed', content: '        Hotjar.init(Number(import.meta.env.VITE_HOTJAR_SITE_ID), 6);' },
    { type: 'removed', content: '    }' },
    { type: 'removed', content: '}' },
];

const MOCK_DIFF_NEW_STORE = [
    { type: 'added', content: 'import { create } from "zustand";' },
    { type: 'added', content: '' },
    { type: 'added', content: 'export const useGitStore = create((set, get) => ({' },
    { type: 'added', content: '    HEAD: "feature/staging-ui",' },
    { type: 'added', content: '    branches: { local: [...], remote: [...] },' },
    { type: 'added', content: '    unstaged: [],  // pliki do staged' },
    { type: 'added', content: '    staged: [],    // pliki gotowe do commita' },
    { type: 'added', content: '' },
    { type: 'added', content: '    stage(fileId)   { /* unstaged → staged  */ },' },
    { type: 'added', content: '    unstage(fileId) { /* staged  → unstaged */ },' },
    { type: 'added', content: '    discard(fileId) { /* odrzuć zmiany      */ },' },
    { type: 'added', content: '    commit(message) { /* utwórz commit      */ },' },
    { type: 'added', content: '    checkout(name)  { /* zmień HEAD         */ },' },
    { type: 'added', content: '}));' },
];

// ─── Mock dane ─────────────────────────────────────────────────────────────

export const MOCK_UNSTAGED = [
    { id: 'src/App.jsx',                      path: 'src/App.jsx',                      status: 'M', diff: MOCK_DIFF_APP },
    { id: 'src/components/layout/Sidebar.jsx', path: 'src/components/layout/Sidebar.jsx', status: 'M', diff: MOCK_DIFF_SIDEBAR },
    { id: 'src/services/analytics.js',         path: 'src/services/analytics.js',         status: 'D', diff: MOCK_DIFF_DELETED },
    { id: 'src/components/pages/OnboardingPage.jsx', path: 'src/components/pages/OnboardingPage.jsx', status: 'D', diff: [
        { type: 'removed', content: 'export default function OnboardingPage() {' },
        { type: 'removed', content: '    return <div>Onboarding</div>;' },
        { type: 'removed', content: '}' },
    ]},
];

export const MOCK_STAGED = [
    { id: 'src/store/useGitStore.js', path: 'src/store/useGitStore.js', status: 'A', diff: MOCK_DIFF_NEW_STORE },
];

export const MOCK_BRANCHES = {
    local: [
        { name: 'main',                       lastCommit: 'a3f2c91', message: 'feat: initial project setup',             date: '2 hours ago',  tracking: 'origin/main' },
        { name: 'feature/staging-ui',          lastCommit: 'b7d1e44', message: 'feat: add staging area store and mocks', date: '35 min ago',   tracking: null },
        { name: 'feature/branches-view',       lastCommit: 'c9a3f12', message: 'wip: branches page layout',             date: '12 min ago',   tracking: null },
        { name: 'fix/settings-firebase-crash', lastCommit: 'd4b2c88', message: 'fix: guard firebase calls when null',   date: '1 day ago',    tracking: 'origin/fix/settings-firebase-crash' },
    ],
    remote: [
        { name: 'origin/main',                       lastCommit: 'a3f2c91', message: 'feat: initial project setup',           date: '2 hours ago' },
        { name: 'origin/fix/settings-firebase-crash', lastCommit: 'd4b2c88', message: 'fix: guard firebase calls when null', date: '1 day ago' },
        { name: 'origin/feature/merge-tool',          lastCommit: 'e1f7a23', message: 'feat: three-panel merge resolver',    date: '3 days ago' },
    ],
};

// ─── Store ──────────────────────────────────────────────────────────────────

export const useGitStore = create((set, get) => ({
    HEAD: 'feature/staging-ui',
    branches: MOCK_BRANCHES,
    unstaged: MOCK_UNSTAGED,
    staged: MOCK_STAGED,
    networkStatus: 'idle',

    stage: (fileId) => set((s) => {
        const file = s.unstaged.find((f) => f.id === fileId);
        if (!file) return s;
        return { unstaged: s.unstaged.filter((f) => f.id !== fileId), staged: [...s.staged, file] };
    }),

    unstage: (fileId) => set((s) => {
        const file = s.staged.find((f) => f.id === fileId);
        if (!file) return s;
        return { staged: s.staged.filter((f) => f.id !== fileId), unstaged: [...s.unstaged, file] };
    }),

    discard: (fileId) => set((s) => ({ unstaged: s.unstaged.filter((f) => f.id !== fileId) })),

    stageAll:   () => set((s) => ({ staged: [...s.staged, ...s.unstaged], unstaged: [] })),
    unstageAll: () => set((s) => ({ unstaged: [...s.unstaged, ...s.staged], staged: [] })),

    commit: (message) => {
        if (!message.trim() || get().staged.length === 0) return;
        set({ staged: [] });
    },

    checkout: (name) => {
        if (!get().branches.local.some((b) => b.name === name)) return;
        set({ HEAD: name });
    },

    createBranch: (name) => {
        if (!name.trim()) return;
        const base = get().branches.local.find((b) => b.name === get().HEAD);
        set((s) => ({
            HEAD: name.trim(),
            branches: {
                ...s.branches,
                local: [...s.branches.local, {
                    name: name.trim(),
                    lastCommit: base?.lastCommit ?? 'a3f2c91',
                    message: `branched off ${s.HEAD}`,
                    date: 'just now',
                    tracking: null,
                }],
            },
        }));
    },

    setNetworkStatus: (status) => set({ networkStatus: status }),
}));
