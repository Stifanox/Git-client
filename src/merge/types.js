/**
 * @typedef {'conflict' | 'change'} MergeBlockVariant
 * conflict = wymaga wyboru strony; change = różnica bez pełnego konfliktu (np. usunięcie po jednej stronie)
 */

/**
 * @typedef {Object} MergeLineRow
 * @property {string} local - treść po stronie „ours” (lokalna)
 * @property {string} incoming - treść po stronie „theirs” (zdalna)
 */

/**
 * @typedef {Object} MergeConflictBlock
 * @property {string} id - stabilny identyfikator hunka (np. z narzędzia diff)
 * @property {number} startLine - 1-based, włącznie
 * @property {number} endLine - 1-based, włącznie
 * @property {string} label - opis dla UI
 * @property {MergeBlockVariant} [variant] - domyślnie 'conflict'
 */

/**
 * Dokument do trójstronnego merge — format niezależny od źródła (mock / Git).
 *
 * @typedef {Object} MergeDocument
 * @property {string} path - ścieżka pliku (jak w repo)
 * @property {MergeLineRow[]} rows - wiersze zsynchronizowane między panelami (ta sama liczba linii)
 * @property {MergeConflictBlock[]} blocks - hunks wymagające uwagi
 * @property {string} [baseBranch] - meta symulacji / przyszły HEAD
 * @property {string} [incomingBranch] - meta symulacji / przyszła gałąź
 */

/**
 * @typedef {'left' | 'right'} BlockChoice
 */

/**
 * @typedef {Record<string, BlockChoice>} BlockChoices
 */

/**
 * @typedef {Record<number, string>} MergedEdits - numer linii (1-based) → treść po ręcznej edycji
 */

/**
 * @typedef {Object} MergeResolutionState
 * @property {BlockChoices} blockChoices
 * @property {MergedEdits} mergedEdits
 */

/**
 * Wynik finalizacji merge — gotowy do zapisu / `git add`.
 *
 * @typedef {Object} MergeResult
 * @property {string} path
 * @property {string} content
 */

/**
 * Stan rozwiązywania jednego pliku w sesji merge.
 *
 * @typedef {Object} MergeFileState
 * @property {string} fileId - stabilny klucz (np. ścieżka lub id scenariusza)
 * @property {MergeDocument} document
 * @property {BlockChoices} blockChoices
 * @property {MergedEdits} mergedEdits
 * @property {string | null} activeBlockId
 */

/**
 * @typedef {Object} MergeSession
 * @property {MergeFileState[]} files
 * @property {string} activeFileId
 */

export {};
