/** @typedef {import('./types.js').MergeDocument} MergeDocument */
/** @typedef {import('./types.js').MergeConflictBlock} MergeConflictBlock */

/**
 * @typedef {{ path: string; diff: Array<{ type: 'context' | 'added' | 'removed'; content: string }> }} StagingFile
 */

/**
 * Zamienia unified diff ze staging area na {@link MergeDocument} dla Visual Merge Tool.
 * `local` = nasza gałąź (removed + context), `incoming` = zdalna (added + context).
 *
 * @param {StagingFile} file
 * @param {{ baseBranch?: string; incomingBranch?: string }} [meta]
 * @returns {MergeDocument}
 */
export function mergeDocumentFromStagingDiff(file, meta = {}) {
    /** @type {MergeDocument['rows']} */
    const rows = [];

    let i = 0;
    while (i < file.diff.length) {
        const line = file.diff[i];

        if (line.type === 'context') {
            rows.push({ local: line.content, incoming: line.content });
            i += 1;
            continue;
        }

        const removed = [];
        const added = [];
        while (i < file.diff.length && file.diff[i].type === 'removed') {
            removed.push(file.diff[i].content);
            i += 1;
        }
        while (i < file.diff.length && file.diff[i].type === 'added') {
            added.push(file.diff[i].content);
            i += 1;
        }

        const span = Math.max(removed.length, added.length, 1);
        for (let j = 0; j < span; j++) {
            rows.push({
                local: removed[j] ?? '',
                incoming: added[j] ?? '',
            });
        }
    }

    const blocks = buildConflictBlocks(rows);

    return {
        path: file.path,
        baseBranch: meta.baseBranch ?? 'HEAD',
        incomingBranch: meta.incomingBranch ?? 'origin/main',
        rows,
        blocks,
    };
}

/**
 * @param {MergeDocument['rows']} rows
 * @returns {MergeConflictBlock[]}
 */
function buildConflictBlocks(rows) {
    /** @type {MergeConflictBlock[]} */
    const blocks = [];
    let rangeStart = null;

    const closeRange = (endIndex) => {
        if (rangeStart === null) return;
        const startLine = rangeStart;
        const endLine = endIndex;
        const sample = rows[startLine - 1];
        const label = (sample?.local || sample?.incoming || 'conflict').trim().slice(0, 48) || 'Conflicting change';
        blocks.push({
            id: `hunk-${blocks.length + 1}`,
            startLine,
            endLine,
            label,
            variant: rows.slice(startLine - 1, endLine).every(
                (r) => (r.local && !r.incoming) || (!r.local && r.incoming),
            )
                ? 'change'
                : 'conflict',
        });
        rangeStart = null;
    };

    for (let idx = 0; idx < rows.length; idx++) {
        const differs = rows[idx].local !== rows[idx].incoming;
        if (differs && rangeStart === null) {
            rangeStart = idx + 1;
        } else if (!differs && rangeStart !== null) {
            closeRange(idx);
        }
    }
    if (rangeStart !== null) {
        closeRange(rows.length);
    }

    return blocks;
}

/**
 * @param {StagingFile[]} files
 * @param {{ baseBranch?: string; incomingBranch?: string }} [meta]
 * @returns {MergeDocument[]}
 */
export function createStagingMergeDocuments(files, meta = {}) {
    return files.map((file) => mergeDocumentFromStagingDiff(file, meta));
}
