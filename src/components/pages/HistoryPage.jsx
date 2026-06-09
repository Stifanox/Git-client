import {
    Search,
    GitCommitHorizontal,
    GitMerge,
    GitCommitVertical,
    FileDiff,
} from 'lucide-react';
import {
    useHistoryStore,
    selectFilteredCommits,
    selectSelectedCommit,
} from '../../store/useHistoryStore.js';

export default function HistoryPage() {
    const branch = useHistoryStore((s) => s.branch);
    const selectedHash = useHistoryStore((s) => s.selectedHash);
    const filterQuery = useHistoryStore((s) => s.filterQuery);
    const setFilterQuery = useHistoryStore((s) => s.setFilterQuery);
    const selectCommit = useHistoryStore((s) => s.selectCommit);
    const commits = useHistoryStore(selectFilteredCommits);
    const selected = useHistoryStore(selectSelectedCommit);

    return (
        <div className="flex flex-col h-full bg-surface overflow-hidden">
            {/* ===== Toolbar ===== */}
            <header className="shrink-0 bg-surface-container-low flex items-center justify-between px-6 py-3 gap-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" strokeWidth={2} />
                    <input
                        type="search"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="Search branches..."
                        className="w-full bg-black rounded-md py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-transparent focus:outline-none focus:border-primary/30"
                    />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button type="button" className="px-4 py-1.5 text-[14px] font-semibold text-on-surface/60 hover:text-on-surface transition-colors font-display">
                        Push
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-1.5 text-[14px] font-bold bg-[#004395] text-[#bdd0ff] rounded-md hover:opacity-90 transition-opacity font-display"
                    >
                        <GitCommitHorizontal className="w-4 h-4" strokeWidth={2} />
                        Commit
                    </button>
                </div>
            </header>

            {/* ===== Body: commit log + details ===== */}
            <div className="flex-1 grid grid-cols-[1fr_420px] min-h-0">
                {/* --- Commit log --- */}
                <section className="flex flex-col min-h-0 border-r border-outline-variant/30">
                    <div className="flex items-center justify-between px-6 py-4 shrink-0">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                            Commit Log
                        </h2>
                        <div className="relative w-48">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-variant" strokeWidth={2} />
                            <input
                                type="search"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Filter commits..."
                                className="w-full bg-surface-container-lowest rounded-md py-1.5 pl-8 pr-3 text-[12px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-outline-variant/30 focus:outline-none focus:border-primary/30"
                            />
                        </div>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-[40px_1fr_140px_110px] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant/70 font-body shrink-0">
                        <span>Graph</span>
                        <span>Message</span>
                        <span>Author</span>
                        <span>Hash</span>
                    </div>

                    <div className="flex-1 overflow-auto min-h-0">
                        {commits.length === 0 ? (
                            <div className="px-6 py-10 text-center text-[13px] text-on-surface-variant font-body">
                                No commits match “{filterQuery}”.
                            </div>
                        ) : (
                            commits.map((c, i) => {
                                const isSelected = c.hash === selectedHash;
                                const isLast = i === commits.length - 1;
                                return (
                                    <button
                                        key={c.hash}
                                        type="button"
                                        onClick={() => selectCommit(c.hash)}
                                        className={`grid grid-cols-[40px_1fr_140px_110px] items-center w-full text-left px-6 py-3.5 border-l-2 transition-colors ${
                                            isSelected
                                                ? 'bg-primary/[0.06] border-primary'
                                                : 'border-transparent hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        {/* Graph node */}
                                        <GraphNode isMerge={c.isMerge} isLast={isLast} active={isSelected} />
                                        {/* Message */}
                                        <div className="min-w-0 pr-4 flex items-center gap-2">
                                            <span className="text-[13.5px] font-medium text-on-surface font-mono truncate">
                                                {c.message}
                                            </span>
                                            {c.tag && (
                                                <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-secondary/15 text-secondary font-body">
                                                    {c.tag}
                                                </span>
                                            )}
                                        </div>
                                        {/* Author */}
                                        <span className="text-[12px] text-on-surface-variant font-body truncate pr-2">
                                            {c.author}
                                        </span>
                                        {/* Hash */}
                                        <span className="text-[11px] font-medium text-primary/80 font-mono">
                                            {c.hash}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* --- Commit details --- */}
                <aside className="flex flex-col min-h-0 bg-surface-container-low/30">
                    <CommitDetails commit={selected} branch={branch} />
                </aside>
            </div>
        </div>
    );
}

function CommitDetails({ commit, branch }) {
    const { details } = commit;
    return (
        <div className="flex flex-col min-h-0 h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-outline-variant/30 shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                        Commit Details
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-[11px] font-medium text-primary/90 font-mono">
                        {commit.fullHash}...
                    </span>
                </div>
                <h3 className="text-[16px] font-bold text-on-surface font-display leading-snug">
                    {commit.message}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-[12px] text-on-surface-variant font-body">
                    <GitMerge className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                    <span>{commit.author}</span>
                    <span className="text-on-surface-variant/50">·</span>
                    <span>{commit.date}</span>
                    <span className="text-on-surface-variant/50">·</span>
                    <span className="font-mono">{branch}</span>
                </div>
                <p className="text-[13px] text-on-surface-variant font-body leading-relaxed mt-3">
                    {details.description}
                </p>
            </div>

            {/* Changed files + diff */}
            <div className="flex-1 overflow-auto min-h-0 px-6 py-5">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-3">
                    Changed Files ({details.files.length})
                </h4>
                <div className="space-y-1 mb-6">
                    {details.files.map((f) => (
                        <div
                            key={f.path}
                            className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-white/[0.02] transition-colors"
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <FileDiff className="w-3.5 h-3.5 text-on-surface-variant shrink-0" strokeWidth={2} />
                                <span className="text-[12.5px] text-on-surface font-mono truncate">{f.path}</span>
                            </span>
                            <span className="flex items-center gap-2 text-[11px] font-mono font-semibold shrink-0">
                                <span className="text-secondary">+{f.added}</span>
                                <span className="text-tertiary">-{f.removed}</span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Diff preview */}
                <div className="rounded-bento border border-outline-variant/40 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low">
                        <span className="text-[11px] font-semibold text-on-surface font-mono">
                            {details.diffFile}
                        </span>
                        <button
                            type="button"
                            className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors font-display"
                        >
                            View Full Diff
                        </button>
                    </div>
                    <div className="bg-surface-container-lowest py-2">
                        {details.diff.map((row, idx) => (
                            <DiffLine key={idx} row={row} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DiffLine({ row }) {
    const sign = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' ';
    const rowClass =
        row.type === 'added'
            ? 'bg-secondary/[0.08] text-secondary'
            : row.type === 'removed'
              ? 'bg-tertiary/[0.08] text-tertiary'
              : 'text-on-surface-variant';
    return (
        <div className={`flex items-start gap-3 px-3 py-0.5 text-[12px] font-mono leading-relaxed ${rowClass}`}>
            <span className="w-8 text-right text-on-surface-variant/50 select-none shrink-0">{row.line}</span>
            <span className="w-3 select-none shrink-0">{sign}</span>
            <span className="whitespace-pre">{row.content}</span>
        </div>
    );
}

function GraphNode({ isMerge, isLast, active }) {
    return (
        <span className="relative flex justify-center self-stretch w-full">
            {/* vertical line */}
            {!isLast && (
                <span className="absolute top-1/2 bottom-[-1.75rem] w-px bg-outline-variant/40" />
            )}
            <span className="absolute top-[-1.75rem] h-[1.75rem] w-px bg-outline-variant/40" />
            {/* node */}
            {isMerge ? (
                <GitMerge
                    className={`relative z-10 w-4 h-4 ${active ? 'text-primary' : 'text-on-surface-variant'}`}
                    strokeWidth={2.5}
                />
            ) : (
                <GitCommitVertical
                    className={`relative z-10 w-4 h-4 ${active ? 'text-primary' : 'text-on-surface-variant'}`}
                    strokeWidth={2.5}
                />
            )}
        </span>
    );
}
