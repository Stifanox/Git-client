import { create } from 'zustand';
import { useToastStore } from './useToastStore.js';
import { useRepoStore } from './useRepoStore.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const localNameFromRemote = (remoteName) => remoteName.replace(/^origin\//, '');

/**
 * Dopisuje wpis do strumienia aktywności widoku Repositories, dzięki czemu
 * operacje na gałęziach (skądkolwiek wywołane) są tam widoczne na żywo.
 */
const logActivity = (level, message) => useRepoStore.getState().pushActivity(level, message);

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
        { name: 'main',                       lastCommit: 'a3f2c91', message: 'feat: initial project setup',             date: '2 hours ago',  tracking: 'origin/main',                        ahead: 0, behind: 2 },
        { name: 'feature/staging-ui',          lastCommit: 'b7d1e44', message: 'feat: add staging area store and mocks', date: '35 min ago',   tracking: null,                                 ahead: 3, behind: 0 },
        { name: 'feature/branches-view',       lastCommit: 'c9a3f12', message: 'wip: branches page layout',             date: '12 min ago',   tracking: null,                                 ahead: 5, behind: 0 },
        { name: 'fix/settings-firebase-crash', lastCommit: 'd4b2c88', message: 'fix: guard firebase calls when null',   date: '1 day ago',    tracking: 'origin/fix/settings-firebase-crash', ahead: 0, behind: 0 },
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

    /** `git checkout <local-branch>` — przełącza HEAD na istniejącą gałąź lokalną. */
    checkout: (name) => {
        if (!get().branches.local.some((b) => b.name === name)) return;
        if (get().HEAD === name) return;
        set({ HEAD: name });
        useToastStore.getState().addToast({ tone: 'success', title: `Switched to ${name}` });
        logActivity('info', `Switched to branch '${name}'`);
    },

    createBranch: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (get().branches.local.some((b) => b.name === trimmed)) {
            useToastStore.getState().addToast({ tone: 'warn', title: 'Branch already exists', description: trimmed });
            return;
        }
        const base = get().branches.local.find((b) => b.name === get().HEAD);
        set((s) => ({
            HEAD: trimmed,
            branches: {
                ...s.branches,
                local: [...s.branches.local, {
                    name: trimmed,
                    lastCommit: base?.lastCommit ?? 'a3f2c91',
                    message: `branched off ${s.HEAD}`,
                    date: 'just now',
                    tracking: null,
                    ahead: 0,
                    behind: 0,
                }],
            },
        }));
        useToastStore.getState().addToast({ tone: 'success', title: `Created ${trimmed}`, description: `Branched off ${base?.name ?? 'HEAD'}` });
        logActivity('info', `Created branch '${trimmed}' from '${base?.name ?? 'HEAD'}'`);
    },

    /**
     * `git push` gałęzi lokalnej na origin. Jeśli gałąź nie ma jeszcze trackingu,
     * publikuje ją (tworzy wpis remote i ustawia upstream). Async — symuluje sieć.
     */
    push: async (branchName) => {
        const name = branchName ?? get().HEAD;
        const branch = get().branches.local.find((b) => b.name === name);
        if (!branch) return;
        if (get().networkStatus !== 'idle') return;

        const { addToast, updateToast } = useToastStore.getState();
        const isPublish = !branch.tracking;
        const remoteName = `origin/${name}`;
        const toastId = addToast({
            tone: 'loading',
            title: isPublish ? `Publishing ${name}…` : `Pushing ${name}…`,
            description: `→ ${remoteName}`,
            duration: 0,
        });

        set({ networkStatus: 'pushing' });
        await delay(900);

        const pushedCount = branch.ahead || 0;
        set((s) => {
            const remoteEntry = { name: remoteName, lastCommit: branch.lastCommit, message: branch.message, date: 'just now' };
            const idx = s.branches.remote.findIndex((r) => r.name === remoteName);
            const remote = idx >= 0
                ? s.branches.remote.map((r, i) => (i === idx ? remoteEntry : r))
                : [...s.branches.remote, remoteEntry];
            const local = s.branches.local.map((b) => (b.name === name ? { ...b, tracking: remoteName, ahead: 0 } : b));
            return { branches: { local, remote }, networkStatus: 'idle' };
        });

        updateToast(toastId, {
            tone: 'success',
            title: isPublish ? `Published ${name}` : `Pushed ${name}`,
            description: `${branch.lastCommit} → ${remoteName}`,
        });
        logActivity('fetch', isPublish
            ? `Published '${name}' to ${remoteName}`
            : `Pushed ${pushedCount} commit${pushedCount === 1 ? '' : 's'} to ${remoteName}`);

        // Odzwierciedlenie pusha w historii widoku Repositories.
        useRepoStore.getState().addCommit({
            hash: branch.lastCommit,
            author: 'You',
            initials: 'ME',
            message: branch.message,
            description: `Pushed to ${remoteName}`,
            date: 'just now',
        });
    },

    /** `git pull` gałęzi śledzącej origin. Async — symuluje sieć. */
    pull: async (branchName) => {
        const name = branchName ?? get().HEAD;
        const branch = get().branches.local.find((b) => b.name === name);
        if (!branch || !branch.tracking) return;
        if (get().networkStatus !== 'idle') return;

        const { addToast, updateToast } = useToastStore.getState();
        const toastId = addToast({
            tone: 'loading',
            title: `Pulling ${name}…`,
            description: `${branch.tracking} → ${name}`,
            duration: 0,
        });

        const pulledCount = branch.behind || 0;
        set({ networkStatus: 'pulling' });
        await delay(900);
        set((s) => ({
            networkStatus: 'idle',
            branches: { ...s.branches, local: s.branches.local.map((b) => (b.name === name ? { ...b, behind: 0 } : b)) },
        }));

        updateToast(toastId, {
            tone: 'success',
            title: pulledCount > 0 ? `Pulled ${name}` : 'Already up to date',
            description: pulledCount > 0
                ? `Fast-forwarded ${pulledCount} commit${pulledCount === 1 ? '' : 's'} from ${branch.tracking}`
                : `${name} is in sync with ${branch.tracking}`,
        });
        logActivity('fetch', pulledCount > 0
            ? `Pulled ${pulledCount} commit${pulledCount === 1 ? '' : 's'} from ${branch.tracking}`
            : `Already up to date with ${branch.tracking}`);
    },

    /**
     * `git checkout <remote-branch>` — tworzy lokalną gałąź śledzącą (jeśli nie
     * istnieje) i przełącza na nią HEAD.
     */
    checkoutRemote: (remoteName) => {
        const remote = get().branches.remote.find((r) => r.name === remoteName);
        if (!remote) return;
        const localName = localNameFromRemote(remoteName);
        const existedBefore = get().branches.local.some((b) => b.name === localName);

        set((s) => {
            const local = existedBefore
                ? s.branches.local
                : [...s.branches.local, {
                    name: localName,
                    lastCommit: remote.lastCommit,
                    message: remote.message,
                    date: 'just now',
                    tracking: remoteName,
                    ahead: 0,
                    behind: 0,
                }];
            return { branches: { ...s.branches, local }, HEAD: localName };
        });

        useToastStore.getState().addToast({
            tone: 'success',
            title: existedBefore ? `Switched to ${localName}` : `Created ${localName}`,
            description: `Tracking ${remoteName}`,
        });
        logActivity('info', existedBefore
            ? `Switched to branch '${localName}'`
            : `Created '${localName}' tracking ${remoteName}`);
    },

    /** Usuwa gałąź lokalną (poza aktualnie wybraną). */
    deleteBranch: (name) => {
        if (name === get().HEAD) {
            useToastStore.getState().addToast({
                tone: 'warn',
                title: 'Cannot delete current branch',
                description: `Checkout another branch before deleting ${name}.`,
            });
            return;
        }
        if (!get().branches.local.some((b) => b.name === name)) return;
        set((s) => ({ branches: { ...s.branches, local: s.branches.local.filter((b) => b.name !== name) } }));
        useToastStore.getState().addToast({ tone: 'info', title: `Deleted branch ${name}` });
        logActivity('warn', `Deleted local branch '${name}'`);
    },

    /** Usuwa gałąź zdalną i czyści tracking u gałęzi lokalnych, które ją śledziły. */
    deleteRemoteBranch: (remoteName) => {
        if (!get().branches.remote.some((r) => r.name === remoteName)) return;
        set((s) => ({
            branches: {
                local: s.branches.local.map((b) => (b.tracking === remoteName ? { ...b, tracking: null } : b)),
                remote: s.branches.remote.filter((r) => r.name !== remoteName),
            },
        }));
        useToastStore.getState().addToast({ tone: 'info', title: `Deleted ${remoteName}` });
        logActivity('warn', `Deleted remote branch '${remoteName}'`);
    },

    setNetworkStatus: (status) => set({ networkStatus: status }),
}));
