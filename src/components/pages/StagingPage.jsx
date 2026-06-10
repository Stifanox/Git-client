import { useState } from 'react';
import { clsx } from 'clsx';
import { Plus, Minus, RotateCcw, GitCommit, FileText, Upload } from 'lucide-react';
import { useGitStore } from '../../store/useGitStore.js';

function StatusBadge({ status }) {
    const cls = {
        M: 'bg-primary/15 text-primary',
        A: 'bg-secondary/15 text-secondary',
        D: 'bg-tertiary/15 text-tertiary',
    }[status] ?? 'bg-surface-container-high text-on-surface-variant';

    return (
        <span className={clsx('inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-extrabold font-mono shrink-0', cls)}>
            {status}
        </span>
    );
}

function FileRow({ file, isSelected, onSelect, onAction, ActionIcon, actionTitle }) {
    return (
        <div
            className={clsx(
                'group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                isSelected ? 'bg-surface-container-highest' : 'hover:bg-surface-container-high',
            )}
            onClick={() => onSelect(file.id)}
        >
            <StatusBadge status={file.status} />
            <span className="flex-1 text-[12px] font-mono text-on-surface-variant truncate" title={file.path}>
                {file.path}
            </span>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAction(file.id); }}
                title={actionTitle}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded text-on-surface-variant hover:text-on-surface transition-all shrink-0"
            >
                <ActionIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
        </div>
    );
}

function DiffViewer({ file }) {
    if (!file) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                <FileText className="w-10 h-10 opacity-20" strokeWidth={1.25} />
                <p className="text-[13px] font-body">Select a file to view diff</p>
            </div>
        );
    }

    const statusLabel = { M: 'Modified', A: 'Added', D: 'Deleted' }[file.status] ?? file.status;
    const addedCount   = file.diff.filter((l) => l.type === 'added').length;
    const removedCount = file.diff.filter((l) => l.type === 'removed').length;

    let leftLn = 1;
    let rightLn = 1;
    const linesWithNumbers = file.diff.map((line) => {
        const l = line.type !== 'added'   ? leftLn  : null;
        const r = line.type !== 'removed' ? rightLn : null;
        if (line.type !== 'added')   leftLn++;
        if (line.type !== 'removed') rightLn++;
        return { ...line, l, r };
    });

    return (
        <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex items-center gap-4 px-6 py-3.5 shrink-0 border-b border-outline-variant">
                <StatusBadge status={file.status} />
                <span className="text-[13px] font-mono text-on-surface flex-1 truncate">{file.path}</span>
                <span className="text-[11px] text-on-surface-variant font-body shrink-0">{statusLabel}</span>
                {addedCount > 0 && (
                    <span className="text-[11px] font-bold text-secondary font-mono">+{addedCount}</span>
                )}
                {removedCount > 0 && (
                    <span className="text-[11px] font-bold text-tertiary font-mono">-{removedCount}</span>
                )}
            </div>

            <div className="font-mono text-[12.5px] flex-1">
                {linesWithNumbers.map((line, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'flex py-px select-text',
                            line.type === 'added'   && 'bg-secondary/8 text-secondary',
                            line.type === 'removed' && 'bg-tertiary/8 text-tertiary',
                            line.type === 'context' && 'text-on-surface-variant',
                        )}
                    >
                        <span className="w-10 shrink-0 text-right pr-3 select-none text-on-surface-variant/25 text-[11px] leading-[1.7]">
                            {line.l ?? ''}
                        </span>
                        <span className="w-10 shrink-0 text-right pr-4 select-none text-on-surface-variant/25 text-[11px] leading-[1.7]">
                            {line.r ?? ''}
                        </span>
                        <span className="w-4 shrink-0 select-none opacity-40 text-center">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                        </span>
                        <span className="whitespace-pre pr-6">{line.content || ' '}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function StagingPage() {
    const { unstaged, staged, stage, unstage, discard, stageAll, unstageAll, commit } = useGitStore();

    const [selectedId, setSelectedId] = useState(() => unstaged[0]?.id ?? staged[0]?.id ?? null);
    const [commitMsg, setCommitMsg]   = useState('');

    const allFiles     = [...unstaged, ...staged];
    const selectedFile = allFiles.find((f) => f.id === selectedId) ?? null;
    const isUnstaged   = (id) => unstaged.some((f) => f.id === id);
    const isStaged     = (id) => staged.some((f) => f.id === id);

    const handleDiscard = (id) => {
        discard(id);
        if (selectedId === id) setSelectedId(unstaged.find((f) => f.id !== id)?.id ?? staged[0]?.id ?? null);
    };

    const handleCommit = () => {
        commit(commitMsg);
        setCommitMsg('');
        setSelectedId(null);
    };

    return (
        <div className="flex h-full bg-surface overflow-hidden">

            {/* Left panel: file list + commit */}
            <aside className="w-72 flex flex-col bg-surface-container-low shrink-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">

                    <div className="px-4 pt-6 pb-2 flex items-center justify-between">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant font-body">
                            Unstaged {unstaged.length > 0 && <span className="text-on-surface">{unstaged.length}</span>}
                        </span>
                        {unstaged.length > 0 && (
                            <button
                                type="button"
                                onClick={stageAll}
                                className="text-[11px] font-semibold text-primary hover:opacity-75 transition-opacity font-body"
                            >
                                Stage All
                            </button>
                        )}
                    </div>
                    <div className="px-2 pb-3 space-y-0.5">
                        {unstaged.length === 0 ? (
                            <p className="px-3 py-2 text-[12px] text-on-surface-variant/40 font-body">No unstaged changes</p>
                        ) : (
                            unstaged.map((f) => (
                                <FileRow
                                    key={f.id}
                                    file={f}
                                    isSelected={selectedId === f.id}
                                    onSelect={setSelectedId}
                                    onAction={stage}
                                    ActionIcon={Plus}
                                    actionTitle="Stage file"
                                />
                            ))
                        )}
                    </div>

                    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant font-body">
                            Staged {staged.length > 0 && <span className="text-on-surface">{staged.length}</span>}
                        </span>
                        {staged.length > 0 && (
                            <button
                                type="button"
                                onClick={unstageAll}
                                className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors font-body"
                            >
                                Unstage All
                            </button>
                        )}
                    </div>
                    <div className="px-2 pb-4 space-y-0.5">
                        {staged.length === 0 ? (
                            <p className="px-3 py-2 text-[12px] text-on-surface-variant/40 font-body">No staged files</p>
                        ) : (
                            staged.map((f) => (
                                <FileRow
                                    key={f.id}
                                    file={f}
                                    isSelected={selectedId === f.id}
                                    onSelect={setSelectedId}
                                    onAction={unstage}
                                    ActionIcon={Minus}
                                    actionTitle="Unstage file"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Commit box */}
                <div className="shrink-0 p-4 border-t border-outline-variant">
                    <textarea
                        value={commitMsg}
                        onChange={(e) => setCommitMsg(e.target.value)}
                        placeholder="Commit message..."
                        rows={3}
                        className="w-full bg-surface-container-lowest rounded-lg px-3 py-2.5 text-[12.5px] font-mono text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
                    />
                    <div className="mt-2.5 flex gap-2">
                        <button
                            type="button"
                            onClick={handleCommit}
                            disabled={staged.length === 0 || !commitMsg.trim()}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container-highest disabled:opacity-30 hover:bg-surface-container-high disabled:cursor-not-allowed text-on-surface px-3 py-2.5 rounded-md font-bold text-[12px] transition-all font-body"
                        >
                            <GitCommit className="w-3.5 h-3.5" strokeWidth={2} />
                            Commit{staged.length > 0 ? ` (${staged.length})` : ''}
                        </button>
                        <button
                            type="button"
                            onClick={handleCommit}
                            disabled={staged.length === 0 || !commitMsg.trim()}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary disabled:opacity-30 hover:opacity-90 disabled:cursor-not-allowed text-surface px-3 py-2.5 rounded-md font-bold text-[12px] transition-all font-body shadow-ambient"
                        >
                            <Upload className="w-3.5 h-3.5" strokeWidth={2} />
                            Commit &amp; Push
                        </button>
                    </div>
                </div>
            </aside>

            {/* Right panel: diff viewer */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-8 py-5 shrink-0">
                    <div>
                        <h2 className="text-[22px] font-extrabold text-on-surface tracking-editorial font-display">
                            Staging Area
                        </h2>
                        <p className="text-[12px] text-on-surface-variant mt-0.5 font-body">
                            {unstaged.length} unstaged &nbsp;·&nbsp; {staged.length} staged
                        </p>
                    </div>

                    {selectedFile && (
                        <div className="flex items-center gap-2">
                            {isUnstaged(selectedFile.id) && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleDiscard(selectedFile.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-tertiary hover:bg-tertiary/10 transition-colors font-body"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                                        Discard
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => stage(selectedFile.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-body"
                                    >
                                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                        Stage File
                                    </button>
                                </>
                            )}
                            {isStaged(selectedFile.id) && (
                                <button
                                    type="button"
                                    onClick={() => unstage(selectedFile.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors font-body"
                                >
                                    <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                                    Unstage
                                </button>
                            )}
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-hidden mx-6 mb-6 bg-surface-container-low rounded-xl flex flex-col">
                    <DiffViewer file={selectedFile} />
                </div>
            </main>
        </div>
    );
}
