import { create } from 'zustand';

/**
 * Symulowany stan repozytorium dla widoku "Repositories".
 * Cała historia jest trzymana w pamięci (brak prawdziwego Gita) zgodnie z
 * założeniem architektonicznym projektu "The Monolithic".
 */

const initialCommits = [
    {
        hash: 'a7f2d8b',
        author: 'James Dalton',
        initials: 'JD',
        message: 'feat: implement asynchronous diff rendering engine',
        description: 'Refactored the core virtual DOM mapping logic for better performance.',
        date: '2 hours ago',
    },
    {
        hash: '55e1c0a',
        author: 'Sarah Chen',
        initials: 'SC',
        message: 'fix: resolved merge conflict in style-system.ts',
        description: 'Co-authored with @ab-dev to fix the production layout shift.',
        date: '5 hours ago',
    },
    {
        hash: '99b4f2e',
        author: 'Mark Low',
        initials: 'ML',
        message: 'docs: updated technical specification for v2.0',
        description: 'Standardized documentation across all core modules.',
        date: 'Yesterday',
    },
    {
        hash: '21d8a3c',
        author: 'Alex Dev',
        initials: 'AD',
        message: 'chore: bump dependencies to latest stable',
        description: 'Includes security patches for critical vulnerabilities.',
        date: '2 days ago',
    },
];

const initialActivity = [
    { id: 1, level: 'info', message: 'Checking local changes... no untracked files found.' },
    { id: 2, level: 'fetch', message: 'Remote origin synced at 14:02:11 GMT+0' },
    { id: 3, level: 'warn', message: '2 submodules are out of sync with main branch.' },
];

export const useRepoStore = create((set, get) => ({
    repository: {
        owner: 'The Monolithic',
        name: 'core-engine',
        branch: 'main',
        ahead: 0,
        behind: 2,
        totalCommits: 1248,
        buildStatus: 'passing',
    },

    commits: initialCommits,
    activity: initialActivity,
    searchQuery: '',
    checkedOutHash: initialCommits[0].hash,

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    /** Symuluje `git checkout <hash>` — zmienia HEAD i loguje do strumienia aktywności. */
    checkout: (hash) => {
        const commit = get().commits.find((c) => c.hash === hash);
        if (!commit) return;
        set({ checkedOutHash: hash });
        get().pushActivity('info', `Checked out ${hash} — "${commit.message}"`);
    },

    /** Dopisuje wpis na koniec strumienia aktywności (symulacja stdout). */
    pushActivity: (level, message) =>
        set((state) => ({
            activity: [...state.activity, { id: state.activity.length + 1, level, message }],
        })),
}));

/** Commity przefiltrowane wg zapytania (message / author / hash). */
export const selectFilteredCommits = (state) => {
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) return state.commits;
    return state.commits.filter(
        (c) =>
            c.message.toLowerCase().includes(q) ||
            c.author.toLowerCase().includes(q) ||
            c.hash.toLowerCase().includes(q)
    );
};
