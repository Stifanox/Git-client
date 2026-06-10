import { create } from 'zustand';

/**
 * Symulowana historia commitów dla widoku "History".
 * Każda gałąź ma własną listę commitów; HEAD z useGitStore wybiera aktywną gałąź.
 * Wstępna historia jest zmockowana — kolejne commity pochodzą z akcji użytkownika (staging / push).
 *
 * Typy linii diffa: 'context' | 'added' | 'removed'.
 */

const DEFAULT_DIFF = [
    { type: 'context', line: 1, content: '  // simulated change' },
    { type: 'added', line: 2, content: '  export const updated = true;' },
];

const PREVIEW_LINE_LIMIT = 6;

const placeholderDiff = (file) => {
    const lines = [{ type: 'context', line: 1, content: `// ${file.path}` }];
    let line = 2;
    for (let i = 0; i < Math.min(file.added, 4); i++) {
        lines.push({ type: 'added', line: line++, content: `  + added line ${i + 1}` });
    }
    for (let i = 0; i < Math.min(file.removed, 2); i++) {
        lines.push({ type: 'removed', line: line++, content: `  - removed line ${i + 1}` });
    }
    return lines.length > 1 ? lines : DEFAULT_DIFF;
};

const normalizeFiles = (files, extra = {}) =>
    files.map((f, i) => ({
        path: f.path,
        added: f.added,
        removed: f.removed,
        diff: f.diff
            ?? extra.fileDiffs?.[f.path]
            ?? (i === 0 ? (extra.diff ?? DEFAULT_DIFF) : placeholderDiff(f)),
    }));

const makeCommit = (hash, message, author, date, extra = {}) => {
    const short = hash.slice(0, 7).toUpperCase();
    const files = normalizeFiles(
        extra.files ?? [{ path: 'src/App.jsx', added: 12, removed: 4 }],
        extra,
    );
    return {
        hash: short,
        fullHash: hash.length === 7 ? `${hash}0` : hash,
        message,
        author,
        date,
        tag: extra.tag ?? null,
        isMerge: extra.isMerge ?? false,
        details: {
            description: extra.description ?? message,
            files,
        },
    };
};

const BASE_MAIN = [
    makeCommit('a3f2c91', 'feat: initial project setup', 'Felix Miller', '2 hours ago', {
        description: 'Bootstrapped the monolithic Git client with routing, auth shell, and design tokens.',
        files: [
            { path: 'src/App.jsx', added: 48, removed: 0 },
            { path: 'src/index.css', added: 120, removed: 0 },
            { path: 'package.json', added: 32, removed: 0 },
        ],
        diffFile: 'App.jsx',
    }),
    makeCommit('f8e1b20', 'chore: scaffold vite + react 19', 'Sarah Chen', '3 hours ago', {
        files: [{ path: 'vite.config.js', added: 18, removed: 0 }],
        diffFile: 'vite.config.js',
    }),
];

const MOCK_BRANCH_HISTORIES = {
    main: [...BASE_MAIN],
    'feature/staging-ui': [
        makeCommit('b7d1e44', 'feat: add staging area store and mocks', 'You', '35 min ago', {
            description: 'Introduced useGitStore staging mocks and diff viewer wiring for the Staging page.',
            fileDiffs: {
                'src/store/useGitStore.js': [
                    { type: 'added', line: 1, content: 'export const MOCK_STAGED = [...];' },
                    { type: 'added', line: 2, content: 'export const MOCK_UNSTAGED = [...];' },
                    { type: 'added', line: 3, content: 'export const MOCK_BRANCHES = { local: [], remote: [] };' },
                    { type: 'context', line: 4, content: '' },
                    { type: 'added', line: 5, content: '    commit(message) { /* creates commit + updates history */ },' },
                    { type: 'added', line: 6, content: '    push(branchName) { /* async publish to origin */ },' },
                    { type: 'added', line: 7, content: '    checkout(name) { /* switch HEAD + history */ },' },
                ],
                'src/components/pages/StagingPage.jsx': [
                    { type: 'context', line: 1, content: 'export default function StagingPage() {' },
                    { type: 'added', line: 2, content: '    const { staged, unstaged, commit, push } = useGitStore();' },
                    { type: 'added', line: 3, content: '    // file list + diff viewer' },
                    { type: 'added', line: 4, content: '    return <div className="flex h-full">...</div>;' },
                    { type: 'context', line: 5, content: '}' },
                ],
            },
            files: [
                { path: 'src/store/useGitStore.js', added: 210, removed: 0 },
                { path: 'src/components/pages/StagingPage.jsx', added: 96, removed: 0 },
            ],
        }),
        ...BASE_MAIN,
    ],
    'feature/branches-view': [
        makeCommit('c9a3f12', 'wip: branches page layout', 'You', '12 min ago', {
            description: 'Local and remote branch lists with checkout, push, and context menu actions.',
            files: [
                { path: 'src/components/pages/BranchesPage.jsx', added: 140, removed: 0 },
                { path: 'src/components/branches/LocalBranchRow.jsx', added: 88, removed: 0 },
            ],
            diffFile: 'BranchesPage.jsx',
        }),
        makeCommit('b7d1e44', 'feat: add staging area store and mocks', 'You', '35 min ago'),
        ...BASE_MAIN,
    ],
    'fix/settings-firebase-crash': [
        makeCommit('d4b2c88', 'fix: guard firebase calls when null', 'Alex Dev', '1 day ago', {
            description: 'Null-safe Firebase init prevents crash when env keys are missing in local dev.',
            files: [{ path: 'src/services/firebase.js', added: 6, removed: 2 }],
            diffFile: 'firebase.js',
            diff: [
                { type: 'context', line: 8, content: 'export const auth = getAuth(app);' },
                { type: 'added', line: 9, content: 'if (!app) return null;' },
            ],
        }),
        ...BASE_MAIN,
    ],
    'feature/merge-tool': [
        makeCommit('e1f7a23', 'feat: three-panel merge resolver', 'Felix Miller', '3 days ago', {
            description: 'Visual Merge Tool with ours/theirs/result panels and conflict block resolution.',
            files: [
                { path: 'src/components/merge/CodePanel.jsx', added: 164, removed: 0 },
                { path: 'src/merge/engine.js', added: 92, removed: 0 },
            ],
            diffFile: 'CodePanel.jsx',
            isMerge: false,
        }),
        ...BASE_MAIN,
    ],
};

const INITIAL_BRANCH = 'feature/staging-ui';

const generateHash = () => Math.random().toString(16).slice(2, 9);

const mapStagingDiff = (rows) => {
    let lineNum = 1;
    return rows.map((row) => ({
        type: row.type,
        line: lineNum++,
        content: row.content,
    }));
};

/** Buduje obiekt commita z plików ze staging area. */
export const buildCommitFromStaged = (message, stagedFiles, author = 'You') => {
    const fullHash = generateHash();
    const files = stagedFiles.map((f) => ({
        path: f.path,
        added: f.diff.filter((d) => d.type === 'added').length,
        removed: f.diff.filter((d) => d.type === 'removed').length,
        diff: mapStagingDiff(f.diff),
    }));

    return makeCommit(fullHash, message.trim(), author, 'just now', {
        description: stagedFiles.length === 1
            ? `Updated ${stagedFiles[0].path}.`
            : `Changed ${stagedFiles.length} files: ${stagedFiles.map((f) => f.path).join(', ')}.`,
        files,
    });
};

export const HISTORY_DIFF_PREVIEW_LIMIT = PREVIEW_LINE_LIMIT;

export const useHistoryStore = create((set, get) => ({
    branch: INITIAL_BRANCH,
    branchHistories: MOCK_BRANCH_HISTORIES,
    commits: MOCK_BRANCH_HISTORIES[INITIAL_BRANCH] ?? [],
    selectedHash: MOCK_BRANCH_HISTORIES[INITIAL_BRANCH]?.[0]?.hash ?? null,
    commitFilterQuery: '',

    setCommitFilterQuery: (commitFilterQuery) => set({ commitFilterQuery }),

    selectCommit: (hash) => set({ selectedHash: hash }),

    /** Przełącza widok historii na daną gałąź (wołane z useGitStore przy checkout). */
    setActiveBranch: (branchName) => {
        const histories = get().branchHistories;
        let commits = histories[branchName];
        if (!commits) {
            commits = [];
            set({ branchHistories: { ...histories, [branchName]: commits } });
        }
        set({
            branch: branchName,
            commits,
            selectedHash: commits[0]?.hash ?? null,
        });
    },

    /** Kopiuje historię rodzica dla nowo utworzonej gałęzi. */
    seedBranchFromParent: (newBranch, parentBranch) => {
        if (get().branchHistories[newBranch]) return;
        const parentCommits = get().branchHistories[parentBranch] ?? [];
        set((s) => ({
            branchHistories: {
                ...s.branchHistories,
                [newBranch]: [...parentCommits],
            },
        }));
    },

    /** Dopisuje commit na wierzch historii danej gałęzi. */
    addCommitToBranch: (branchName, commit) =>
        set((s) => {
            const branchCommits = [commit, ...(s.branchHistories[branchName] ?? [])];
            const branchHistories = { ...s.branchHistories, [branchName]: branchCommits };
            const updates = { branchHistories };
            if (s.branch === branchName) {
                updates.commits = branchCommits;
                updates.selectedHash = commit.hash;
            }
            return updates;
        }),
}));
