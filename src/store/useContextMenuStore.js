import { create } from 'zustand';

/**
 * Globalny stan jednego, współdzielonego menu kontekstowego.
 *
 * Menu jest renderowane raz (overlay w AppLayout), a dowolny komponent może je
 * otworzyć podając pozycję kursora i listę akcji. Dzięki temu definicja akcji
 * żyje tam, gdzie nastąpiło kliknięcie prawym przyciskiem (per komponent),
 * a sama prezentacja menu jest jedna dla całej aplikacji.
 *
 * Kształt pozycji menu (`item`):
 *   { id, label, icon?, onSelect?, disabled?, danger?, hint? }
 *   { separator: true }  // pozioma linia rozdzielająca grupy akcji
 */
export const useContextMenuStore = create((set) => ({
    open: false,
    x: 0,
    y: 0,
    items: [],

    openMenu: ({ x, y, items }) => set({ open: true, x, y, items }),
    closeMenu: () => set({ open: false, items: [] }),
}));
