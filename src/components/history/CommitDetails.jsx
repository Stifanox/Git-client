import { GitMerge, FileDiff } from 'lucide-react';
import DiffLine from './DiffLine';

export default function CommitDetails({ commit, branch }) {
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
