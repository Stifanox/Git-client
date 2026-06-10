/** Współdzielone mocki diffów staging — używane przez useGitStore i merge tool. */

export const STAGING_MERGE_PATHS = [
    'src/App.jsx',
    'src/components/layout/Sidebar.jsx',
];

export const MOCK_DIFF_APP = [
    { type: 'context', content: 'import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";' },
    { type: 'context', content: 'import AppLayout from "./components/layout/AppLayout";' },
    { type: 'context', content: '' },
    { type: 'removed', content: 'import AuthBootstrap from "./components/auth/AuthBootstrap.jsx";' },
    { type: 'removed', content: 'import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";' },
    { type: 'added', content: 'import StagingPage from "./components/pages/StagingPage.jsx";' },
    { type: 'added', content: 'import BranchesPage from "./components/pages/BranchesPage.jsx";' },
    { type: 'context', content: 'import SettingsPage from "./components/pages/SettingsPage.jsx";' },
    { type: 'context', content: '' },
    { type: 'context', content: 'export default function App() {' },
    { type: 'context', content: '    return (' },
    { type: 'context', content: '        <BrowserRouter>' },
    { type: 'removed', content: '            <AuthBootstrap />' },
    { type: 'context', content: '            <Routes>' },
    { type: 'removed', content: '                <Route element={<ProtectedRoute />}>' },
    { type: 'added', content: '                <Route element={<AppLayout />}>' },
    { type: 'context', content: '                    <Route path="/settings" element={<SettingsPage />} />' },
    { type: 'added', content: '                    <Route path="/staging"  element={<StagingPage />} />' },
    { type: 'added', content: '                    <Route path="/branches" element={<BranchesPage />} />' },
    { type: 'context', content: '                </Route>' },
    { type: 'context', content: '            </Routes>' },
    { type: 'context', content: '        </BrowserRouter>' },
    { type: 'context', content: '    );' },
    { type: 'context', content: '}' },
];

export const MOCK_DIFF_SIDEBAR = [
    { type: 'context', content: 'import { NavLink } from "react-router-dom";' },
    { type: 'removed', content: 'import { ..., LogOut } from "lucide-react";' },
    { type: 'added', content: 'import { Database, GitBranch, History, List, Settings } from "lucide-react";' },
    { type: 'context', content: '' },
    { type: 'removed', content: 'import { useAuthStore } from "../../store/useAuthStore.js";' },
    { type: 'context', content: '' },
    { type: 'context', content: 'export default function Sidebar() {' },
    { type: 'removed', content: '    const { user, logout } = useAuthStore();' },
    { type: 'context', content: '    const topNavItems = [' },
    { type: 'context', content: '        { icon: Database,  label: "Repositories", path: "/repositories" },' },
    { type: 'added', content: '        { icon: GitBranch, label: "Branches",     path: "/branches" },' },
    { type: 'added', content: '        { icon: List,      label: "Staging",      path: "/staging" },' },
    { type: 'context', content: '        { icon: Settings,  label: "Settings",     path: "/settings" },' },
    { type: 'context', content: '    ];' },
];

export const MOCK_DIFF_DELETED = [
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

export const MOCK_DIFF_NEW_STORE = [
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

export const STAGING_MERGE_MOCK_FILES = {
    'src/App.jsx': {
        id: 'src/App.jsx',
        path: 'src/App.jsx',
        status: 'M',
        diff: MOCK_DIFF_APP,
    },
    'src/components/layout/Sidebar.jsx': {
        id: 'src/components/layout/Sidebar.jsx',
        path: 'src/components/layout/Sidebar.jsx',
        status: 'M',
        diff: MOCK_DIFF_SIDEBAR,
    },
};
