import { useMemo, useState, useRef, useEffect } from 'react';
import { Search, GitCommitHorizontal, GitBranch, Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useGitStore } from '../../store/useGitStore.js';
import { useHistoryStore } from '../../store/useHistoryStore.js';
import GraphNode from '../history/GraphNode';
import CommitDetails from '../history/CommitDetails';

export default function HistoryPage() {
    const { HEAD, branches, checkout } = useGitStore(useShallow((s) => ({
        HEAD: s.HEAD,
        branches: s.branches.local,
        checkout: s.checkout,
    })));

    const commits = useHistoryStore(useShallow((s) => s.commits));
    const selectedHash = useHistoryStore((s) => s.selectedHash);
    const commitFilterQuery = useHistoryStore((s) => s.commitFilterQuery);
    const setCommitFilterQuery = useHistoryStore((s) => s.setCommitFilterQuery);
    const selectCommit = useHistoryStore((s) => s.selectCommit);

    const [branchQuery, setBranchQuery] = useState('');
    const [branchMenuOpen, setBranchMenuOpen] = useState(false);
    const branchSearchRef = useRef(null);

    const filteredCommits = useMemo(() => {
        const q = commitFilterQuery.trim().toLowerCase();
        if (!q) return commits;
        return commits.filter(
            (c) =>
                c.message.toLowerCase().includes(q) ||
                c.author.toLowerCase().includes(q) ||
                c.hash.toLowerCase().includes(q),
        );
    }, [commits, commitFilterQuery]);

    const selected = useMemo(() => {
        if (commits.length === 0) return null;
        return commits.find((c) => c.hash === selectedHash) ?? commits[0];
    }, [commits, selectedHash]);

    const matchingBranches = useMemo(() => {
        const q = branchQuery.trim().toLowerCase();
        if (!q) return branches;
        return branches.filter((b) => b.name.toLowerCase().includes(q));
    }, [branches, branchQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (branchSearchRef.current && !branchSearchRef.current.contains(e.target)) {
                setBranchMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBranchSelect = (name) => {
        checkout(name);
        setBranchQuery('');
        setBranchMenuOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-surface overflow-hidden">
            <header className="shrink-0 bg-surface-container-low flex items-center justify-between px-6 py-3 gap-4">
                <div className="relative w-full max-w-md" ref={branchSearchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" strokeWidth={2} />
                    <input
                        type="search"
                        value={branchQuery}
                        onChange={(e) => {
                            setBranchQuery(e.target.value);
                            setBranchMenuOpen(true);
                        }}
                        onFocus={() => setBranchMenuOpen(true)}
                        placeholder="Search branches..."
                        className="w-full bg-black rounded-md py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-transparent focus:outline-none focus:border-primary/30"
                    />
                    {branchMenuOpen && matchingBranches.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-surface-container-highest rounded-bento shadow-ambient border border-outline-variant/30 overflow-hidden max-h-56 overflow-y-auto">
                            {matchingBranches.map((b) => (
                                <button
                                    key={b.name}
                                    type="button"
                                    onClick={() => handleBranchSelect(b.name)}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-surface-container-high transition-colors"
                                >
                                    <GitBranch className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2} />
                                    <span className="text-[13px] font-mono text-on-surface truncate flex-1">{b.name}</span>
                                    {b.name === HEAD && (
                                        <Check className="w-3.5 h-3.5 text-secondary shrink-0" strokeWidth={2.5} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    {branchMenuOpen && branchQuery.trim() && matchingBranches.length === 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-surface-container-highest rounded-bento shadow-ambient border border-outline-variant/30 px-4 py-3 text-[12px] text-on-surface-variant font-body">
                            No branches match “{branchQuery}”.
                        </div>
                    )}
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

            <div className="flex-1 grid grid-cols-[1fr_420px] min-h-0">
                <section className="flex flex-col min-h-0 border-r border-outline-variant/30">
                    <div className="flex items-center justify-between px-6 py-4 shrink-0">
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                                Commit Log
                            </h2>
                            <p className="text-[12px] text-primary font-mono mt-1">{HEAD}</p>
                        </div>
                        <div className="relative w-48">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-variant" strokeWidth={2} />
                            <input
                                type="search"
                                value={commitFilterQuery}
                                onChange={(e) => setCommitFilterQuery(e.target.value)}
                                placeholder="Filter commits..."
                                className="w-full bg-surface-container-lowest rounded-md py-1.5 pl-8 pr-3 text-[12px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-outline-variant/30 focus:outline-none focus:border-primary/30"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-[40px_1fr_140px_110px] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant/70 font-body shrink-0">
                        <span>Graph</span>
                        <span>Message</span>
                        <span>Author</span>
                        <span>Hash</span>
                    </div>

                    <div className="flex-1 overflow-auto min-h-0">
                        {filteredCommits.length === 0 ? (
                            <div className="px-6 py-10 text-center text-[13px] text-on-surface-variant font-body">
                                No commits match “{commitFilterQuery}”.
                            </div>
                        ) : (
                            filteredCommits.map((c, i) => {
                                const isSelected = c.hash === selectedHash;
                                const isLast = i === filteredCommits.length - 1;
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
                                        <GraphNode isMerge={c.isMerge} isLast={isLast} active={isSelected} />
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
                                        <span className="text-[12px] text-on-surface-variant font-body truncate pr-2">
                                            {c.author}
                                        </span>
                                        <span className="text-[11px] font-medium text-primary/80 font-mono">
                                            {c.hash}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                <aside className="flex flex-col min-h-0 bg-surface-container-low/30">
                    {selected ? (
                        <CommitDetails commit={selected} branch={HEAD} />
                    ) : (
                        <div className="flex flex-1 items-center justify-center px-6 text-[13px] text-on-surface-variant font-body">
                            No commits on {HEAD}.
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
