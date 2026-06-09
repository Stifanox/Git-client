import { create } from 'zustand';

/**
 * Symulowana historia commitów dla widoku "History".
 * Lewy panel to graf commit-log, prawy to szczegóły zaznaczonego commita
 * (zmienione pliki + podgląd diffa). Wszystko w pamięci.
 *
 * Typy linii diffa: 'context' | 'added' | 'removed'.
 */

const commits = [
    {
        hash: '7A1F2BC',
        fullHash: '7a1f2bc8',
        message: 'feat: implement architectural tonal logic in renderer',
        author: 'Felix Miller',
        date: '2 hours ago',
        tag: 'STABLE',
        isMerge: false,
        details: {
            description:
                'This update removes all persistent structural lines from the main view, opting instead for background shifts (tonal logic) to define sections. Improved readability on high-density displays.',
            files: [
                { path: 'src/ui/Renderer.tsx', added: 142, removed: 12 },
                { path: 'src/theme/tokens.json', added: 58, removed: 0 },
                { path: 'styles/borders.css', added: 0, removed: 340 },
                { path: 'src/ui/Surface.tsx', added: 24, removed: 6 },
            ],
            diffFile: 'Renderer.tsx',
            diff: [
                { type: 'context', line: 342, content: '  const render = () => {' },
                { type: 'removed', line: 343, content: "    const border = '1px solid gray';" },
                { type: 'added', line: 343, content: "    const shadow = 'tonal-shift';" },
                { type: 'added', line: 344, content: "    const base = 'surface-container';" },
                { type: 'context', line: 345, content: '    return (' },
            ],
        },
    },
    {
        hash: '9F00A32',
        fullHash: '9f00a32d',
        message: "merge: branch 'hotfix/ui-overflow' into main",
        author: 'Sarah Chen',
        date: 'Yesterday at 14:22',
        tag: null,
        isMerge: true,
        details: {
            description:
                "Merged the 'hotfix/ui-overflow' branch resolving the horizontal scroll regression on the merge tool panels.",
            files: [
                { path: 'src/components/merge/CodePanel.tsx', added: 18, removed: 4 },
                { path: 'src/components/merge/useSyncedScroll.ts', added: 9, removed: 2 },
            ],
            diffFile: 'CodePanel.tsx',
            diff: [
                { type: 'context', line: 56, content: '  <section className="panel">' },
                { type: 'removed', line: 57, content: '    <div className="overflow-visible">' },
                { type: 'added', line: 57, content: '    <div className="overflow-auto min-w-0">' },
                { type: 'context', line: 58, content: '      {lines.map(renderLine)}' },
            ],
        },
    },
    {
        hash: '1C2E4D5',
        fullHash: '1c2e4d5f',
        message: 'fix: layout shift on resolution change',
        author: 'Felix Miller',
        date: 'Yesterday at 09:10',
        tag: null,
        isMerge: false,
        details: {
            description:
                'Locked the sidebar width and switched the main grid to fractional units to prevent cumulative layout shift when the viewport resizes.',
            files: [
                { path: 'src/components/layout/AppLayout.tsx', added: 11, removed: 7 },
                { path: 'src/components/layout/Sidebar.tsx', added: 3, removed: 1 },
            ],
            diffFile: 'AppLayout.tsx',
            diff: [
                { type: 'context', line: 14, content: '  <div className="flex h-screen">' },
                { type: 'removed', line: 15, content: '    <aside className="w-auto">' },
                { type: 'added', line: 15, content: '    <aside className="w-[260px] shrink-0">' },
                { type: 'context', line: 16, content: '      <Sidebar />' },
            ],
        },
    },
    {
        hash: 'D4E5F6G',
        fullHash: 'd4e5f6a1',
        message: 'refactor: abstract surface layering logic',
        author: 'Felix Miller',
        date: 'Oct 24, 2023',
        tag: null,
        isMerge: false,
        details: {
            description:
                'Extracted the stacked-obsidian surface tokens into a single layering helper so depth levels stay consistent across panels and modals.',
            files: [
                { path: 'src/theme/layers.ts', added: 64, removed: 0 },
                { path: 'src/index.css', added: 12, removed: 28 },
            ],
            diffFile: 'layers.ts',
            diff: [
                { type: 'added', line: 1, content: 'export const surface = (depth: number) => {' },
                { type: 'added', line: 2, content: '  return SURFACE_SCALE[depth] ?? SURFACE_SCALE[0];' },
                { type: 'added', line: 3, content: '};' },
            ],
        },
    },
];

export const useHistoryStore = create((set) => ({
    branch: 'main',
    commits,
    selectedHash: commits[0].hash,
    filterQuery: '',

    setFilterQuery: (filterQuery) => set({ filterQuery }),
    selectCommit: (hash) => set({ selectedHash: hash }),
}));

/** Commity przefiltrowane wg zapytania (message / author / hash). */
export const selectFilteredCommits = (state) => {
    const q = state.filterQuery.trim().toLowerCase();
    if (!q) return state.commits;
    return state.commits.filter(
        (c) =>
            c.message.toLowerCase().includes(q) ||
            c.author.toLowerCase().includes(q) ||
            c.hash.toLowerCase().includes(q)
    );
};

/** Aktualnie zaznaczony commit (do panelu szczegółów). */
export const selectSelectedCommit = (state) =>
    state.commits.find((c) => c.hash === state.selectedHash) ?? state.commits[0];
