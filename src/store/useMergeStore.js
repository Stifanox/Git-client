import { create } from 'zustand';
import {
    allBlocksResolved,
    countUnresolvedBlocks,
    countResolvedBlocks,
    createMergeResult,
    getBlockById,
    getBaselineMergedContent,
    linesInBlock,
} from '../merge/engine.js';
import { createDemoMergeSession } from '../merge/scenarios/index.js';

/** @typedef {import('../merge/types.js').MergeFileState} MergeFileState */

function clearEditsForBlock(document, mergedEdits, blockId) {
    const next = { ...mergedEdits };
    for (const line of linesInBlock(document, blockId)) {
        delete next[line];
    }
    return next;
}

function getActiveFile(state) {
    return state.files.find((f) => f.fileId === state.activeFileId) ?? state.files[0];
}

function mapActiveFile(state, updater) {
    return state.files.map((file) => {
        if (file.fileId !== state.activeFileId) return file;
        return { ...file, ...updater(file) };
    });
}

const demoSession = createDemoMergeSession();
const initialActive = getActiveFile({ files: demoSession.files, activeFileId: demoSession.activeFileId });
const initialBlock = initialActive
    ? getBlockById(initialActive.document, initialActive.activeBlockId ?? '')
    : null;

export const useMergeStore = create((set, get) => ({
    files: demoSession.files,
    activeFileId: demoSession.activeFileId,
    mergeApplied: false,
    mergeResults: null,

    searchQuery: '',
    cursor: { line: initialBlock?.startLine ?? 1, col: 1 },

    setActiveFile: (fileId) => {
        const { files } = get();
        const file = files.find((f) => f.fileId === fileId);
        if (!file) return;
        const block = file.activeBlockId
            ? getBlockById(file.document, file.activeBlockId)
            : file.document.blocks[0];
        set({
            activeFileId: fileId,
            cursor: { line: block?.startLine ?? 1, col: 1 },
        });
    },

    /** Docelowo: otwarcie sesji z wieloma plikami po konflikcie Gita. */
    openMergeSession: (documents) => {
        const files = documents.map((document) => ({
            fileId: document.path,
            document,
            blockChoices: {},
            mergedEdits: {},
            activeBlockId: document.blocks[0]?.id ?? null,
        }));
        const first = files[0];
        set({
            files,
            activeFileId: first?.fileId ?? null,
            mergeApplied: false,
            mergeResults: null,
            searchQuery: '',
            cursor: { line: first?.document.blocks[0]?.startLine ?? 1, col: 1 },
        });
    },

    applyBlockFromLeft: (blockId) => {
        set((state) => {
            const active = getActiveFile(state);
            if (!active) return state;
            const block = getBlockById(active.document, blockId);
            if (!block) return state;
            return {
                files: mapActiveFile(state, (file) => ({
                    blockChoices: { ...file.blockChoices, [blockId]: 'left' },
                    mergedEdits: clearEditsForBlock(file.document, file.mergedEdits, blockId),
                    activeBlockId: blockId,
                })),
                mergeApplied: false,
                mergeResults: null,
                cursor: { line: block.startLine, col: 1 },
            };
        });
    },

    applyBlockFromRight: (blockId) => {
        set((state) => {
            const active = getActiveFile(state);
            if (!active) return state;
            const block = getBlockById(active.document, blockId);
            if (!block) return state;
            return {
                files: mapActiveFile(state, (file) => ({
                    blockChoices: { ...file.blockChoices, [blockId]: 'right' },
                    mergedEdits: clearEditsForBlock(file.document, file.mergedEdits, blockId),
                    activeBlockId: blockId,
                })),
                mergeApplied: false,
                mergeResults: null,
                cursor: { line: block.startLine, col: 1 },
            };
        });
    },

    setActiveBlock: (blockId) => {
        const { files, activeFileId } = get();
        const active = files.find((f) => f.fileId === activeFileId);
        if (!active) return undefined;
        const block = getBlockById(active.document, blockId);
        if (!block) return undefined;
        set((state) => ({
            files: mapActiveFile(state, () => ({ activeBlockId: blockId })),
            cursor: { line: block.startLine, col: 1 },
        }));
        return block.startLine;
    },

    setMergedLineContent: (line, content) => {
        set((state) => {
            const active = getActiveFile(state);
            if (!active) return state;

            const baseline = getBaselineMergedContent(
                active.document,
                line,
                active.blockChoices
            );
            const hadEdit = Object.hasOwn(active.mergedEdits, line);
            const needsEdit = content !== baseline;

            if (needsEdit) {
                if (hadEdit && active.mergedEdits[line] === content) return state;
            } else if (!hadEdit) {
                return state;
            }

            return {
                files: mapActiveFile(state, (file) => {
                    const mergedEdits = { ...file.mergedEdits };
                    if (needsEdit) {
                        mergedEdits[line] = content;
                    } else {
                        delete mergedEdits[line];
                    }
                    return { mergedEdits };
                }),
                mergeApplied: false,
                mergeResults: null,
            };
        });
    },

    setCursor: (cursor) => set({ cursor }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    applyMerge: () => {
        const { files } = get();
        const allReady = files.every((file) =>
            allBlocksResolved(file.document, file.blockChoices, file.mergedEdits)
        );
        if (!allReady) return;
        set({
            mergeApplied: true,
            mergeResults: files.map((file) =>
                createMergeResult(file.document, file.blockChoices, file.mergedEdits)
            ),
        });
    },
}));

/** @param {import('../merge/types.js').MergeFileState} file */
function isFileResolved(file) {
    return allBlocksResolved(file.document, file.blockChoices, file.mergedEdits);
}

export const selectActiveFile = (state) => getActiveFile(state);

export const selectDocument = (state) => selectActiveFile(state)?.document;

export const selectBlocks = (state) => selectActiveFile(state)?.document.blocks;

export const selectBlockChoices = (state) => selectActiveFile(state)?.blockChoices;

export const selectMergedEdits = (state) => selectActiveFile(state)?.mergedEdits;

export const selectActiveBlockId = (state) => selectActiveFile(state)?.activeBlockId ?? null;

export const selectUnresolvedBlocks = (state) => {
    const active = selectActiveFile(state);
    if (!active) return 0;
    return countUnresolvedBlocks(active.document, active.blockChoices, active.mergedEdits);
};

export const selectResolvedBlocks = (state) => {
    const active = selectActiveFile(state);
    if (!active) return 0;
    return countResolvedBlocks(active.document, active.blockChoices, active.mergedEdits);
};

export const selectFileStatuses = (state) =>
    state.files.map((file) => {
        const unresolved = countUnresolvedBlocks(
            file.document,
            file.blockChoices,
            file.mergedEdits
        );
        return {
            fileId: file.fileId,
            path: file.document.path,
            resolved: isFileResolved(file),
            unresolvedBlocks: unresolved,
            totalBlocks: file.document.blocks.length,
        };
    });

export const selectResolvedFileCount = (state) =>
    state.files.filter(isFileResolved).length;

export const selectCanApplyMerge = (state) =>
    state.files.length > 0 &&
    state.files.every(isFileResolved) &&
    !state.mergeApplied;
