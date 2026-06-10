import { useCallback } from 'react';
import { useContextMenuStore } from '../../store/useContextMenuStore.js';

/**
 * Zwraca handler `onContextMenu`, który otwiera globalne menu kontekstowe
 * w miejscu kursora.
 *
 * `itemsOrBuilder` to tablica pozycji albo funkcja `(event) => items`. Wariant
 * z funkcją pozwala budować akcje zależnie od kontekstu kliknięcia, np. od
 * konkretnego wiersza czy zaznaczenia. Zwrócenie pustej listy nie otwiera menu
 * (przeglądarka pokaże wtedy swoje natywne menu).
 *
 * Użycie:
 *   const onContextMenu = useContextMenu(() => [
 *     { id: 'checkout', label: 'Checkout', icon: GitBranch, onSelect: () => checkout(name) },
 *   ]);
 *   return <div onContextMenu={onContextMenu}>…</div>;
 */
export function useContextMenu(itemsOrBuilder) {
    const openMenu = useContextMenuStore((s) => s.openMenu);

    return useCallback(
        (event) => {
            const items = typeof itemsOrBuilder === 'function' ? itemsOrBuilder(event) : itemsOrBuilder;
            if (!items || items.length === 0) return;
            event.preventDefault();
            event.stopPropagation();
            openMenu({ x: event.clientX, y: event.clientY, items });
        },
        [itemsOrBuilder, openMenu],
    );
}
