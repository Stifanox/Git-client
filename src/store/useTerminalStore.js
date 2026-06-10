import { create } from 'zustand';

const WELCOME = [
    'The Monolithic — simulated shell (git commands only)',
    'Type `help` for available commands.',
];

export const useTerminalStore = create((set, get) => ({
    isOpen: false,
    lines: WELCOME.map((text) => ({ type: 'output', text })),

    open: () => set({ isOpen: true }),

    close: () => set({ isOpen: false }),

    toggle: () => set({ isOpen: !get().isOpen }),

    appendLines: (textLines) =>
        set((s) => ({
            lines: [
                ...s.lines,
                ...textLines.map((text) => ({ type: 'output', text })),
            ],
        })),

    appendCommand: (command) =>
        set((s) => ({
            lines: [...s.lines, { type: 'input', text: command }],
        })),

    clear: () => set({ lines: [] }),
}));
