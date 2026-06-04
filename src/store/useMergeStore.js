import { create } from 'zustand';
import {
    countUnresolvedBlocks,
    countResolvedBlocks,
    allBlocksResolved,
    getBlockById,
    getBaselineMergedContent,
    linesInBlock,
} from './mergeMockFile.js';

function clearEditsForBlock(mergedEdits, blockId, blockChoices) {
    const next = { ...mergedEdits };
    for (const line of linesInBlock(blockId)) {
        delete next[line];
    }
    return next;
}

export const useMergeStore = create((set, get) => ({
    fileName: 'main_controller.ts',
    branch: 'main',
    searchQuery: '',
    lastSync: '2 mins ago',
    cursor: { line: 20, col: 1 },
    activeBlockId: 'c1',
    showConflictOverlay: true,
    mergeApplied: false,

    blockChoices: {},
    mergedEdits: {},

    applyBlockFromLeft: (blockId) => {
        const block = getBlockById(blockId);
        if (!block) return;
        set((state) => {
            const blockChoices = { ...state.blockChoices, [blockId]: 'left' };
            const mergedEdits = clearEditsForBlock(state.mergedEdits, blockId, blockChoices);
            return {
                blockChoices,
                mergedEdits,
                activeBlockId: blockId,
                cursor: { line: block.startLine, col: 1 },
                showConflictOverlay: countUnresolvedBlocks(blockChoices, mergedEdits) > 0,
            };
        });
    },

    applyBlockFromRight: (blockId) => {
        const block = getBlockById(blockId);
        if (!block) return;
        set((state) => {
            const blockChoices = { ...state.blockChoices, [blockId]: 'right' };
            const mergedEdits = clearEditsForBlock(state.mergedEdits, blockId, blockChoices);
            return {
                blockChoices,
                mergedEdits,
                activeBlockId: blockId,
                cursor: { line: block.startLine, col: 1 },
                showConflictOverlay: countUnresolvedBlocks(blockChoices, mergedEdits) > 0,
            };
        });
    },

    setActiveBlock: (blockId) => {
        const block = getBlockById(blockId);
        if (!block) return undefined;
        set({
            activeBlockId: blockId,
            showConflictOverlay: true,
            cursor: { line: block.startLine, col: 1 },
        });
        return block.startLine;
    },

    setMergedLineContent: (line, content) => {
        set((state) => {
            const baseline = getBaselineMergedContent(line, state.blockChoices);
            const mergedEdits = { ...state.mergedEdits };
            if (content === baseline) {
                delete mergedEdits[line];
            } else {
                mergedEdits[line] = content;
            }
            return {
                mergedEdits,
                cursor: { line, col: Math.max(1, content.length) },
            };
        });
    },

    setCursor: (cursor) => set({ cursor }),

    dismissConflictOverlay: () => set({ showConflictOverlay: false }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    applyMerge: () => {
        const { blockChoices, mergedEdits } = get();
        if (!allBlocksResolved(blockChoices, mergedEdits)) return;
        set({ mergeApplied: true, showConflictOverlay: false });
    },
}));

export const selectUnresolvedBlocks = (state) =>
    countUnresolvedBlocks(state.blockChoices, state.mergedEdits);
export const selectResolvedBlocks = (state) =>
    countResolvedBlocks(state.blockChoices, state.mergedEdits);
export const selectCanApplyMerge = (state) =>
    allBlocksResolved(state.blockChoices, state.mergedEdits) && !state.mergeApplied;
export const selectActiveBlockLine = (state) => {
    const block = getBlockById(state.activeBlockId);
    return block?.startLine ?? null;
};

export { MERGE_BLOCKS } from './mergeMockFile.js';
