import {
    Search,
    Download,
    Upload,
    RefreshCw,
    GitMerge,
    Undo2,
    Redo2,
} from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
    buildMergedLines,
    buildLocalFile,
    buildIncomingFile,
    isBlockResolved,
    allBlocksResolved,
    countUnresolvedBlocks,
} from '../../merge/engine.js';
import {
    useMergeStore,
    selectUnresolvedBlocks,
    selectResolvedBlocks,
    selectCanApplyMerge,
    selectDocument,
    selectBlocks,
    selectBlockChoices,
    selectMergedEdits,
    selectActiveBlockId,
    selectResolvedFileCount,
} from '../../store/useMergeStore.js';
import CodePanel from '../merge/CodePanel';
import MergedLineRow from '../merge/MergedLineRow';
import { useSyncedScroll } from '../merge/useSyncedScroll';

export default function MergePage() {
    const document = useMergeStore(selectDocument);
    const blocks = useMergeStore(selectBlocks) ?? [];
    const blockChoices = useMergeStore(selectBlockChoices) ?? {};
    const mergedEdits = useMergeStore(selectMergedEdits) ?? {};
    const activeBlockId = useMergeStore(selectActiveBlockId);
    const files = useMergeStore(useShallow((s) => s.files));
    const resolvedFileCount = useMergeStore(selectResolvedFileCount);

    const {
        activeFileId,
        searchQuery,
        mergeApplied,
        applyBlockFromLeft,
        applyBlockFromRight,
        setActiveBlock,
        setMergedLineContent,
        setSearchQuery,
        setActiveFile,
        applyMerge,
    } = useMergeStore(
        useShallow((s) => ({
            activeFileId: s.activeFileId,
            searchQuery: s.searchQuery,
            mergeApplied: s.mergeApplied,
            applyBlockFromLeft: s.applyBlockFromLeft,
            applyBlockFromRight: s.applyBlockFromRight,
            setActiveBlock: s.setActiveBlock,
            setMergedLineContent: s.setMergedLineContent,
            setSearchQuery: s.setSearchQuery,
            setActiveFile: s.setActiveFile,
            applyMerge: s.applyMerge,
        }))
    );

    const fileStatuses = useMemo(
        () =>
            files.map((file) => {
                const unresolved = countUnresolvedBlocksForFile(file);
                return {
                    fileId: file.fileId,
                    path: file.document.path,
                    resolved: isFileResolvedForUi(file),
                    unresolvedBlocks: unresolved,
                    totalBlocks: file.document.blocks.length,
                };
            }),
        [files]
    );

    const localLines = useMemo(
        () => (document ? buildLocalFile(document, blockChoices) : []),
        [document, blockChoices]
    );
    const incomingLines = useMemo(
        () => (document ? buildIncomingFile(document, blockChoices) : []),
        [document, blockChoices]
    );
    const unresolvedBlocks = useMergeStore(selectUnresolvedBlocks);
    const resolvedBlocks = useMergeStore(selectResolvedBlocks);
    const canApplyMerge = useMergeStore(selectCanApplyMerge);

    const mergedLines = useMemo(
        () => (document ? buildMergedLines(document, blockChoices, mergedEdits) : []),
        [document, blockChoices, mergedEdits]
    );

    const { scrollRef, onScroll, scrollToLine } = useSyncedScroll(3);

    const activeBlock = blocks.find((b) => b.id === activeBlockId) ?? blocks[0];
    const fileName = document?.path.split('/').pop() ?? '';
    const totalFiles = fileStatuses.length;

    const handleBlockNav = useCallback(
        (blockId) => {
            const startLine = setActiveBlock(blockId);
            if (startLine) {
                scrollToLine(startLine);
            }
        },
        [setActiveBlock, scrollToLine]
    );

    const handleApplyBlockLeft = useCallback(
        (blockId) => {
            applyBlockFromLeft(blockId);
            scrollToLine(getBlockStartLine(blocks, blockId));
        },
        [applyBlockFromLeft, scrollToLine, blocks]
    );

    const handleApplyBlockRight = useCallback(
        (blockId) => {
            applyBlockFromRight(blockId);
            scrollToLine(getBlockStartLine(blocks, blockId));
        },
        [applyBlockFromRight, scrollToLine, blocks]
    );

    if (!document) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-surface overflow-hidden">
            <header className="shrink-0 bg-surface-container-low flex items-center justify-between px-6 py-3">
                <div className="flex-1 flex justify-center max-w-md mx-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" strokeWidth={2} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conflicts..."
                            className="w-full bg-black rounded-md py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 font-body border border-transparent focus:outline-none focus:border-primary/30"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <button type="button" className="p-2 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" aria-label="Fetch">
                            <Download className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button type="button" className="p-2 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" aria-label="Pull">
                            <Upload className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button type="button" className="p-2 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" aria-label="Refresh">
                            <RefreshCw className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
                        <button type="button" className="px-4 py-1.5 text-[14px] font-semibold text-on-surface/60 hover:text-on-surface transition-colors font-display">
                            Push
                        </button>
                        <button type="button" className="px-4 py-1.5 text-[14px] font-bold bg-[#004395] text-[#bdd0ff] rounded-md hover:opacity-90 transition-opacity font-display">
                            Commit
                        </button>
                    </div>
                </div>
            </header>

            <div className="shrink-0 bg-surface-container-low flex items-center justify-between px-8 py-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <GitMerge className="w-3 h-3 text-tertiary shrink-0" strokeWidth={2.5} />
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-[16px] font-bold text-on-surface font-display truncate">{fileName}</h2>
                            <label className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-body">
                                    File
                                </span>
                                <select
                                    value={activeFileId ?? ''}
                                    onChange={(e) => setActiveFile(e.target.value)}
                                    className="bg-surface-container-high text-on-surface text-[11px] font-mono rounded-md px-2 py-1 border border-outline-variant/30 focus:outline-none focus:border-primary/40 min-w-[220px]"
                                    title="Switch conflicted file"
                                >
                                    {fileStatuses.map((file) => (
                                        <option key={file.fileId} value={file.fileId}>
                                            {formatFileOptionLabel(file)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <p className="text-[12px] text-on-surface-variant font-mono mt-0.5 truncate">
                            <span className="text-on-surface-variant/80">{document.path}</span>
                            <span className="text-on-surface-variant/50 mx-2">·</span>
                            {unresolvedBlocks} block{unresolvedBlocks === 1 ? '' : 's'} remaining in this file
                            <span className="text-on-surface-variant/50 mx-2">·</span>
                            {resolvedFileCount}/{totalFiles} files resolved
                            <span className="text-on-surface-variant/50 mx-2">·</span>
                            {mergedLines.length} lines
                            {document.baseBranch && (
                                <>
                                    <span className="text-on-surface-variant/50 mx-2">·</span>
                                    {document.baseBranch}
                                    {document.incomingBranch && ` ← ${document.incomingBranch}`}
                                </>
                            )}
                            {mergeApplied && (
                                <span className="text-secondary ml-2">· Merge applied</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                    {blocks.map((b) => {
                        const resolved = isBlockResolved(document, blockChoices, mergedEdits, b.id);
                        return (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => handleBlockNav(b.id)}
                                className={clsxBlockButton(activeBlockId === b.id, resolved)}
                                title={`${b.label} — scroll to lines ${b.startLine}–${b.endLine}`}
                            >
                                {b.startLine}–{b.endLine}
                                {resolved && ' ✓'}
                            </button>
                        );
                    })}
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-bento ml-2">
                        <span
                            className={`w-2 h-2 rounded-full ${canApplyMerge || mergeApplied ? 'bg-secondary' : 'bg-primary'}`}
                        />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-body">
                            {resolvedBlocks}/{blocks.length} blocks · {resolvedFileCount}/{totalFiles} files
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={applyMerge}
                        disabled={!canApplyMerge}
                        className="bg-primary text-[#003d88] px-5 py-1.5 rounded text-[14px] font-bold hover:opacity-90 transition-opacity font-display disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:opacity-35"
                        title={
                            canApplyMerge
                                ? 'Finalize merge for all files'
                                : mergeApplied
                                  ? 'Merge already applied'
                                  : `Resolve all files (${resolvedFileCount}/${totalFiles} ready)`
                        }
                    >
                        Apply Merge
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-3 min-h-0 min-w-0">
                <CodePanel
                    title="Local Changes"
                    side="left"
                    lines={localLines}
                    blockChoices={blockChoices}
                    activeBlockId={activeBlockId}
                    actionLabel="Accept Left"
                    onAction={() => activeBlock && applyBlockFromLeft(activeBlock.id)}
                    onApplyBlock={handleApplyBlockLeft}
                    scrollRef={scrollRef(0)}
                    onScroll={onScroll(0)}
                />
                <section className="flex flex-col min-h-0 min-w-0 bg-surface border-l border-outline-variant/30 h-full">
                    <header className="bg-[rgba(0,67,149,0.1)] border-b border-primary/20 flex items-center justify-between px-3 py-3 shrink-0 z-10">
                        <span className="text-[12px] font-bold tracking-[1.2px] uppercase text-primary font-body">
                            Merged Result
                        </span>
                        <div className="flex gap-2 text-on-surface-variant">
                            <button type="button" className="hover:text-on-surface transition-colors" aria-label="Undo">
                                <Undo2 className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                            <button type="button" className="hover:text-on-surface transition-colors" aria-label="Redo">
                                <Redo2 className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                        </div>
                    </header>
                    <div
                        ref={scrollRef(1)}
                        onScroll={onScroll(1)}
                        className="flex-1 overflow-auto min-h-0"
                    >
                        <div className="min-w-max pt-4 pb-24">
                            {mergedLines.map((line) => (
                                <MergedLineRow
                                    key={line.id}
                                    lineNumber={line.line}
                                    content={line.content}
                                    type={line.type}
                                    onChange={(value) => setMergedLineContent(line.line, value)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                <CodePanel
                    title="Incoming Changes"
                    side="right"
                    lines={incomingLines}
                    blockChoices={blockChoices}
                    activeBlockId={activeBlockId}
                    actionLabel="Accept Right"
                    onAction={() => activeBlock && applyBlockFromRight(activeBlock.id)}
                    onApplyBlock={handleApplyBlockRight}
                    scrollRef={scrollRef(2)}
                    onScroll={onScroll(2)}
                />
            </div>
        </div>
    );
}

function isFileResolvedForUi(file) {
    return allBlocksResolved(file.document, file.blockChoices, file.mergedEdits);
}

function countUnresolvedBlocksForFile(file) {
    return countUnresolvedBlocks(file.document, file.blockChoices, file.mergedEdits);
}

function formatFileOptionLabel(file) {
    const shortPath = file.path.split('/').pop() ?? file.path;
    if (file.resolved) {
        return `✓ ${shortPath}`;
    }
    const left = file.unresolvedBlocks;
    return `○ ${shortPath} (${left} conflict${left === 1 ? '' : 's'})`;
}

function getBlockStartLine(blocks, blockId) {
    return blocks.find((b) => b.id === blockId)?.startLine ?? 1;
}

function clsxBlockButton(isActive, isResolved) {
    const base = 'text-[10px] font-bold px-2 py-1 rounded-md transition-colors font-body';
    if (isActive) return `${base} bg-primary/20 text-primary`;
    if (isResolved) return `${base} bg-secondary/15 text-secondary`;
    return `${base} bg-surface-container-high text-on-surface-variant hover:text-on-surface`;
}
