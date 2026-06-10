import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { GitMerge, FileDiff, X } from 'lucide-react';
import { HISTORY_DIFF_PREVIEW_LIMIT } from '../../store/useHistoryStore.js';
import DiffLine from './DiffLine';

export default function CommitDetails({ commit, branch }) {
    const { details } = commit;
    const [selectedPath, setSelectedPath] = useState(details.files[0]?.path ?? null);
    const [showFullDiff, setShowFullDiff] = useState(false);

    useEffect(() => {
        setSelectedPath(details.files[0]?.path ?? null);
        setShowFullDiff(false);
    }, [commit.hash, details.files]);

    useEffect(() => {
        if (!showFullDiff) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setShowFullDiff(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showFullDiff]);

    const selectedFile = details.files.find((f) => f.path === selectedPath) ?? details.files[0] ?? null;
    const diffRows = selectedFile?.diff ?? [];
    const hasMoreLines = diffRows.length > HISTORY_DIFF_PREVIEW_LIMIT;
    const previewDiff = diffRows.slice(0, HISTORY_DIFF_PREVIEW_LIMIT);
    const fileName = selectedFile?.path.split('/').pop() ?? 'diff';

    return (
        <div className="flex flex-col min-h-0 h-full">
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

            <div className="flex-1 overflow-auto min-h-0 px-6 py-5">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-3">
                    Changed Files ({details.files.length})
                </h4>
                <div className="space-y-1 mb-6">
                    {details.files.map((f) => {
                        const isActive = f.path === selectedFile?.path;
                        return (
                            <button
                                key={f.path}
                                type="button"
                                onClick={() => {
                                    setSelectedPath(f.path);
                                    setShowFullDiff(false);
                                }}
                                className={clsx(
                                    'flex items-center justify-between gap-3 w-full px-3 py-2 rounded-md transition-colors text-left',
                                    isActive
                                        ? 'bg-primary/[0.08] ring-1 ring-primary/25'
                                        : 'hover:bg-white/[0.02]',
                                )}
                            >
                                <span className="flex items-center gap-2 min-w-0">
                                    <FileDiff
                                        className={clsx('w-3.5 h-3.5 shrink-0', isActive ? 'text-primary' : 'text-on-surface-variant')}
                                        strokeWidth={2}
                                    />
                                    <span className="text-[12.5px] text-on-surface font-mono truncate">{f.path}</span>
                                </span>
                                <span className="flex items-center gap-2 text-[11px] font-mono font-semibold shrink-0">
                                    <span className="text-secondary">+{f.added}</span>
                                    <span className="text-tertiary">-{f.removed}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {selectedFile && (
                    <div className="rounded-bento border border-outline-variant/40 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low">
                            <span className="text-[11px] font-semibold text-on-surface font-mono truncate pr-2">
                                {fileName}
                            </span>
                            {hasMoreLines && (
                                <button
                                    type="button"
                                    onClick={() => setShowFullDiff(true)}
                                    className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors font-display shrink-0"
                                >
                                    View Full Diff
                                </button>
                            )}
                        </div>
                        <div className="bg-surface-container-lowest py-2">
                            {previewDiff.map((row, idx) => (
                                <DiffLine key={`${row.line}-${idx}`} row={row} />
                            ))}
                            {hasMoreLines && (
                                <p className="px-3 py-2 text-[11px] text-on-surface-variant/60 font-body">
                                    {diffRows.length - HISTORY_DIFF_PREVIEW_LIMIT} more lines — click View Full Diff
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showFullDiff && selectedFile && (
                <div
                    className="fixed inset-0 z-50 flex flex-col bg-surface/95 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Full diff for ${selectedFile.path}`}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 shrink-0 bg-surface-container-low">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                                Full Diff
                            </p>
                            <p className="text-[13px] font-mono text-on-surface truncate mt-1">{selectedFile.path}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFullDiff(false)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-body"
                        >
                            <X className="w-4 h-4" strokeWidth={2} />
                            Close
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto bg-surface-container-lowest py-2 font-mono">
                        {diffRows.map((row, idx) => (
                            <DiffLine key={`full-${row.line}-${idx}`} row={row} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
