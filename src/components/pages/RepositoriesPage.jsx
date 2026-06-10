import {
    Search,
    Download,
    Upload,
    RefreshCw,
    Archive,
    GitCommitHorizontal,
    GitCompareArrows,
    CheckCircle2,
    ArrowUp,
    ArrowDown,
    GitMerge,
    Trash2,
    Tag,
    ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRepoStore, selectFilteredCommits } from '../../store/useRepoStore.js';
import { useGitStore } from '../../store/useGitStore.js';
import ToolbarButton from '../repositories/ToolbarButton';
import Avatar from '../repositories/Avatar';
import StatPill from '../repositories/StatPill';

export default function RepositoriesPage() {
    const navigate = useNavigate();
    const repository = useRepoStore((s) => s.repository);
    const activity = useRepoStore((s) => s.activity);
    const searchQuery = useRepoStore((s) => s.searchQuery);
    const checkedOutHash = useRepoStore((s) => s.checkedOutHash);
    const setSearchQuery = useRepoStore((s) => s.setSearchQuery);
    const checkout = useRepoStore((s) => s.checkout);
    const pushActivity = useRepoStore((s) => s.pushActivity);
    const commits = useRepoStore(selectFilteredCommits);

    // Aktualnie wybrana gałąź pochodzi z globalnego symulatora Git (widok Branches).
    const HEAD = useGitStore((s) => s.HEAD);
    const localBranches = useGitStore((s) => s.branches.local);
    const networkStatus = useGitStore((s) => s.networkStatus);
    const push = useGitStore((s) => s.push);
    const pull = useGitStore((s) => s.pull);
    const currentBranch = localBranches.find((b) => b.name === HEAD);
    const ahead = currentBranch?.ahead ?? 0;
    const behind = currentBranch?.behind ?? 0;
    const tracking = currentBranch?.tracking ?? null;
    const busy = networkStatus !== 'idle';

    const quickActions = [
        {
            icon: GitMerge,
            label: 'Merge Main',
            hint: 'Sync into current',
            accent: 'text-primary',
            onClick: () => navigate('/merge'),
        },
        { icon: Archive, label: 'Stash All', hint: 'Save for later', accent: 'text-on-surface' },
        { icon: Trash2, label: 'Discard', hint: 'Clear workspace', accent: 'text-tertiary' },
        { icon: Tag, label: 'Create Tag', hint: 'Release v2.0.1', accent: 'text-secondary' },
    ];

    return (
        <div className="flex flex-col h-full bg-surface overflow-hidden">
            {/* ===== Toolbar ===== */}
            <header className="shrink-0 bg-surface-container-low flex items-center justify-between px-6 py-3 gap-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" strokeWidth={2} />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search commits..."
                        className="w-full bg-black rounded-md py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-transparent focus:outline-none focus:border-primary/30"
                    />
                </div>
                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={Download} label="Pull" onClick={() => pull(HEAD)} disabled={busy || !tracking} spinning={networkStatus === 'pulling'} />
                        <ToolbarButton icon={Upload} label={tracking ? 'Push' : 'Publish'} onClick={() => push(HEAD)} disabled={busy} spinning={networkStatus === 'pushing'} />
                        <ToolbarButton icon={RefreshCw} label="Fetch" onClick={() => pushActivity('fetch', 'Fetching refs from origin...')} />
                        <ToolbarButton icon={Archive} label="Stash" onClick={() => pushActivity('info', 'Working tree stashed.')} />
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/staging')}
                        className="flex items-center gap-2 px-4 py-1.5 text-[14px] font-bold bg-[#004395] text-[#bdd0ff] rounded-md hover:opacity-90 transition-opacity font-display"
                    >
                        <GitCommitHorizontal className="w-4 h-4" strokeWidth={2} />
                        Commit
                    </button>
                </div>
            </header>

            {/* ===== Body ===== */}
            <div className="flex-1 grid grid-cols-[1fr_340px] min-h-0">
                {/* --- Main column --- */}
                <div className="overflow-auto min-h-0 px-8 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[13px] font-body mb-6">
                        <span className="text-on-surface-variant">{repository.owner}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/50" strokeWidth={2} />
                        <span className="text-on-surface font-semibold">{repository.name}</span>
                    </div>

                    {/* Repository history header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-[22px] font-extrabold text-on-surface font-display tracking-editorial">
                                Repository History
                            </h2>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => navigate('/branches')}
                                    title="Manage branches"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-[12px] font-semibold text-on-surface font-mono hover:bg-surface-container-highest transition-colors"
                                >
                                    <GitMerge className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                                    {HEAD}
                                </button>
                                {tracking ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-[11px] font-bold uppercase tracking-wider text-secondary font-body">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Synced
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-[11px] font-bold uppercase tracking-wider text-tertiary font-body">
                                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                                        Local only
                                    </span>
                                )}
                                <StatPill icon={ArrowUp} label="Ahead" value={`${ahead} commits`} tone="neutral" />
                                <StatPill icon={ArrowDown} label="Behind" value={`${behind} commits`} tone="warn" />
                            </div>
                            {currentBranch && (
                                <p className="text-[12px] text-on-surface-variant font-mono mt-2.5">
                                    <span className="text-primary/90">{currentBranch.lastCommit}</span>
                                    <span className="text-on-surface-variant/50 mx-2">·</span>
                                    {currentBranch.message}
                                    <span className="text-on-surface-variant/50 mx-2">·</span>
                                    {tracking ?? 'no upstream'}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/branches')}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-surface-container-high text-[13px] font-semibold text-on-surface hover:bg-surface-container-highest transition-colors font-display shrink-0"
                        >
                            <GitCompareArrows className="w-4 h-4 text-primary" strokeWidth={2} />
                            Compare Branches
                        </button>
                    </div>

                    {/* Build status */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-bento bg-secondary/[0.07] border border-secondary/20 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                            Build Status
                        </span>
                        <span className="flex items-center gap-2 text-[13px] font-semibold text-secondary font-display">
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                            Pipeline Passing
                        </span>
                    </div>

                    {/* Commit table */}
                    <div className="rounded-bento border border-outline-variant/40 overflow-hidden">
                        <div className="grid grid-cols-[160px_1fr_110px_120px_120px] px-4 py-2.5 bg-surface-container-low text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant font-body">
                            <span>Author</span>
                            <span>Commit Message</span>
                            <span>Hash</span>
                            <span>Date</span>
                            <span className="text-right">Actions</span>
                        </div>
                        {commits.length === 0 ? (
                            <div className="px-4 py-10 text-center text-[13px] text-on-surface-variant font-body">
                                No commits match “{searchQuery}”.
                            </div>
                        ) : (
                            commits.map((c) => {
                                const isHead = c.hash === checkedOutHash;
                                return (
                                    <div
                                        key={c.hash}
                                        className="grid grid-cols-[160px_1fr_110px_120px_120px] items-center px-4 py-3.5 border-t border-outline-variant/25 hover:bg-white/[0.02] transition-colors"
                                    >
                                        {/* Author */}
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Avatar initials={c.initials} />
                                            <span className="text-[13px] font-medium text-on-surface font-body truncate">
                                                {c.author}
                                            </span>
                                        </div>
                                        {/* Message + description */}
                                        <div className="min-w-0 pr-4">
                                            <p className="text-[13.5px] font-semibold text-on-surface font-mono truncate">
                                                {c.message}
                                            </p>
                                            <p className="text-[12px] text-on-surface-variant font-body truncate mt-0.5">
                                                {c.description}
                                            </p>
                                        </div>
                                        {/* Hash */}
                                        <span className="text-[12px] font-medium text-primary/90 font-mono">{c.hash}</span>
                                        {/* Date */}
                                        <span className="text-[12px] text-on-surface-variant font-body">{c.date}</span>
                                        {/* Action */}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => checkout(c.hash)}
                                                disabled={isHead}
                                                className={
                                                    isHead
                                                        ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-secondary bg-secondary/10 cursor-default font-display'
                                                        : 'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors font-display'
                                                }
                                            >
                                                {isHead ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                        Current
                                                    </>
                                                ) : (
                                                    'Checkout'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 font-body mt-4">
                        Showing {commits.length} of {repository.totalCommits.toLocaleString('en-US')} commits
                    </p>
                </div>

                {/* --- Right panel --- */}
                <aside className="border-l border-outline-variant/30 bg-surface-container-low/40 flex flex-col min-h-0">
                    {/* Quick actions */}
                    <div className="px-5 py-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-3">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            {quickActions.map((a) => (
                                <button
                                    key={a.label}
                                    type="button"
                                    onClick={a.onClick ?? (() => pushActivity('info', `${a.label} — ${a.hint}`))}
                                    className="flex flex-col items-start gap-2 p-3 rounded-bento bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 transition-colors text-left"
                                >
                                    <a.icon className={`w-4 h-4 ${a.accent}`} strokeWidth={2} />
                                    <span className="text-[13px] font-semibold text-on-surface font-display leading-none">
                                        {a.label}
                                    </span>
                                    <span className="text-[11px] text-on-surface-variant font-body leading-none">
                                        {a.hint}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity stream */}
                    <div className="flex flex-col flex-1 min-h-0 border-t border-outline-variant/30">
                        <div className="flex items-center justify-between px-5 py-3 shrink-0">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                                Activity Stream
                            </h3>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary font-body">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                Stdout Active
                            </span>
                        </div>
                        <div className="flex-1 overflow-auto min-h-0 px-5 pb-5 space-y-2">
                            {activity.map((line) => (
                                <p key={line.id} className="text-[12px] font-mono leading-relaxed">
                                    <span className={`font-bold mr-2 ${levelColor(line.level)}`}>
                                        {line.level}
                                    </span>
                                    <span className="text-on-surface-variant">{line.message}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function levelColor(level) {
    switch (level) {
        case 'fetch':
            return 'text-primary';
        case 'warn':
            return 'text-tertiary';
        default:
            return 'text-secondary';
    }
}
