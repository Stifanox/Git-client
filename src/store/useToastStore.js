import { create } from 'zustand';

/**
 * Globalne, ulotne powiadomienia (toasty) służące do feedbacku akcji —
 * szczególnie tych asynchronicznych (push / pull / fetch).
 *
 * Toast (`tone`): 'success' | 'info' | 'warn' | 'error' | 'loading'.
 * Toast typu 'loading' zwykle tworzymy z `duration: 0` (nie znika sam),
 * a po zakończeniu operacji aktualizujemy go przez `updateToast`.
 */
let nextId = 1;

const DEFAULT_DURATION = 3200;

export const useToastStore = create((set, get) => ({
    toasts: [],

    addToast: ({ title, description, tone = 'info', duration = DEFAULT_DURATION }) => {
        const id = nextId++;
        set((s) => ({ toasts: [...s.toasts, { id, title, description, tone }] }));
        if (duration > 0) {
            setTimeout(() => get().dismissToast(id), duration);
        }
        return id;
    },

    updateToast: (id, patch, duration = DEFAULT_DURATION) => {
        set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
        if (duration > 0) {
            setTimeout(() => get().dismissToast(id), duration);
        }
    },

    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
