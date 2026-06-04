/** @typedef {import('./types.js').MergeDocument} MergeDocument */

/**
 * Przyszły adapter: zamiana konfliktu z Gita na {@link MergeDocument}.
 *
 * Oczekiwany przepływ:
 * 1. Odczyt `ours` / `theirs` / opcjonalnie `base` dla ścieżki z indeksu merge.
 * 2. Wyrównanie linii (np. libgit2 / diff3) → tablica `rows`.
 * 3. Hunks z markerów `<<<<<<<` / `=======` / `>>>>>>>` → `blocks`.
 * 4. UI wywołuje engine + store; po Apply Merge → `content` zapis do work tree.
 *
 * @param {{ path: string; ours: string; theirs: string; base?: string }} _input
 * @returns {MergeDocument}
 */
export function mergeDocumentFromGitConflict(_input) {
    throw new Error(
        'mergeDocumentFromGitConflict is not implemented — use merge scenarios or wire Git output here'
    );
}
