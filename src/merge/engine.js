/** @typedef {import('./types.js').MergeDocument} MergeDocument */
/** @typedef {import('./types.js').MergeConflictBlock} MergeConflictBlock */
/** @typedef {import('./types.js').BlockChoices} BlockChoices */
/** @typedef {import('./types.js').MergedEdits} MergedEdits */
/** @typedef {import('./types.js').MergeResult} MergeResult */

function rowEqual(row) {
    return row.local === row.incoming;
}

function blockVariant(block) {
    return block?.variant ?? 'conflict';
}

/**
 * @param {MergeDocument} document
 * @param {number} lineNum
 */
export function getBlockForLine(document, lineNum) {
    return document.blocks.find((b) => lineNum >= b.startLine && lineNum <= b.endLine) ?? null;
}

/**
 * @param {MergeDocument} document
 * @param {string} blockId
 * @returns {MergeConflictBlock | null}
 */
export function getBlockById(document, blockId) {
    return document.blocks.find((b) => b.id === blockId) ?? null;
}

/**
 * @param {MergeDocument} document
 * @param {number} lineNum
 * @param {BlockChoices} [blockChoices]
 */
export function getBaselineMergedContent(document, lineNum, blockChoices = {}) {
    const row = document.rows[lineNum - 1];
    if (!row) return '';
    const block = getBlockForLine(document, lineNum);
    const choice = block ? blockChoices[block.id] : null;
    if (choice === 'right') return row.incoming;
    return row.local;
}

function sideLineType(document, line, block, blockChoice, side) {
    if (blockChoice === side) return 'applied';
    if (block && !blockChoice) {
        const row = document.rows[line - 1];
        if (!rowEqual(row)) {
            return blockVariant(block) === 'change' ? 'changed' : 'conflict';
        }
    }
    return 'normal';
}

export function buildLocalFile(document, blockChoices = {}) {
    return document.rows.map((row, i) => {
        const line = i + 1;
        const block = getBlockForLine(document, line);
        const blockChoice = block ? blockChoices[block.id] : null;
        return {
            id: `local-${line}`,
            line,
            content: row.local,
            blockId: block?.id ?? null,
            isBlockStart: block?.startLine === line,
            type: sideLineType(document, line, block, blockChoice, 'left'),
        };
    });
}

export function buildIncomingFile(document, blockChoices = {}) {
    return document.rows.map((row, i) => {
        const line = i + 1;
        const block = getBlockForLine(document, line);
        const blockChoice = block ? blockChoices[block.id] : null;
        return {
            id: `incoming-${line}`,
            line,
            content: row.incoming,
            blockId: block?.id ?? null,
            isBlockStart: block?.startLine === line,
            type: sideLineType(document, line, block, blockChoice, 'right'),
        };
    });
}

export function buildMergedLines(document, blockChoices = {}, mergedEdits = {}) {
    return document.rows.map((row, index) => {
        const line = index + 1;
        const block = getBlockForLine(document, line);
        const baseline = getBaselineMergedContent(document, line, blockChoices);

        if (Object.hasOwn(mergedEdits, line) && mergedEdits[line] !== baseline) {
            return {
                id: `merged-${line}`,
                line,
                content: mergedEdits[line],
                type: 'normal',
                source: 'manual',
            };
        }

        const choice = block ? blockChoices[block.id] : null;

        if (choice === 'left') {
            return {
                id: `merged-${line}`,
                line,
                content: row.local,
                type: 'resolved-result',
                source: 'left',
            };
        }

        if (choice === 'right') {
            return {
                id: `merged-${line}`,
                line,
                content: row.incoming,
                type: 'resolved-result',
                source: 'right',
            };
        }

        if (block && !rowEqual(row)) {
            return {
                id: `merged-${line}`,
                line,
                content: baseline,
                type: blockVariant(block) === 'change' ? 'changed' : 'conflict',
            };
        }

        return {
            id: `merged-${line}`,
            line,
            content: baseline,
            type: 'normal',
        };
    });
}

/**
 * @param {MergeDocument} document
 * @param {BlockChoices} blockChoices
 * @param {MergedEdits} mergedEdits
 */
export function buildMergedFileContent(document, blockChoices, mergedEdits) {
    return buildMergedLines(document, blockChoices, mergedEdits)
        .map((line) => line.content)
        .join('\n');
}

/**
 * @param {MergeDocument} document
 * @param {string} blockId
 */
export function linesInBlock(document, blockId) {
    const block = getBlockById(document, blockId);
    if (!block) return [];
    const lines = [];
    for (let l = block.startLine; l <= block.endLine; l++) lines.push(l);
    return lines;
}

export function isBlockResolved(document, blockChoices, mergedEdits, blockId) {
    if (blockChoices[blockId]) return true;
    const block = getBlockById(document, blockId);
    if (!block) return false;
    for (let l = block.startLine; l <= block.endLine; l++) {
        const baseline = getBaselineMergedContent(document, l, blockChoices);
        const hasCustomEdit =
            Object.hasOwn(mergedEdits, l) && mergedEdits[l] !== baseline;
        if (!hasCustomEdit) return false;
    }
    return true;
}

export function countUnresolvedBlocks(document, blockChoices, mergedEdits = {}) {
    return document.blocks.filter(
        (b) => !isBlockResolved(document, blockChoices, mergedEdits, b.id)
    ).length;
}

export function countResolvedBlocks(document, blockChoices, mergedEdits = {}) {
    return document.blocks.filter((b) =>
        isBlockResolved(document, blockChoices, mergedEdits, b.id)
    ).length;
}

export function allBlocksResolved(document, blockChoices, mergedEdits = {}) {
    return countUnresolvedBlocks(document, blockChoices, mergedEdits) === 0;
}

/**
 * @param {MergeDocument} document
 * @param {BlockChoices} blockChoices
 * @param {MergedEdits} mergedEdits
 * @returns {MergeResult}
 */
export function createMergeResult(document, blockChoices, mergedEdits) {
    return {
        path: document.path,
        content: buildMergedFileContent(document, blockChoices, mergedEdits),
    };
}
