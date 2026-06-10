import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTerminalStore } from '../../store/useTerminalStore.js';
import { executeTerminalCommand, terminalPrompt } from '../../terminal/gitCommands.js';

export default function TerminalPanel() {
    const lines = useTerminalStore((s) => s.lines);
    const appendLines = useTerminalStore((s) => s.appendLines);
    const appendCommand = useTerminalStore((s) => s.appendCommand);
    const clear = useTerminalStore((s) => s.clear);
    const close = useTerminalStore((s) => s.close);

    const [input, setInput] = useState('');
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    const runCommand = (raw) => {
        const command = raw.trim();
        if (!command) return;

        appendCommand(`${terminalPrompt()} ${command}`);
        const result = executeTerminalCommand(command);

        if (result.clear) {
            clear();
            return;
        }
        if (result.close) {
            close();
            return;
        }
        if (result.lines?.length) {
            appendLines(result.lines);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        runCommand(input);
        setInput('');
    };

    return (
        <div className="shrink-0 h-56 flex flex-col border-t border-outline-variant/40 bg-[#0a0a0a] font-mono text-[12.5px]">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant font-body">
                    Terminal
                </span>
                <button
                    type="button"
                    onClick={close}
                    className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    aria-label="Close terminal"
                >
                    <X className="w-4 h-4" strokeWidth={2} />
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className={
                            line.type === 'input'
                                ? 'text-on-surface leading-relaxed whitespace-pre-wrap'
                                : 'text-on-surface-variant leading-relaxed whitespace-pre-wrap'
                        }
                    >
                        {line.text}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-t border-outline-variant/25">
                <span className="text-secondary shrink-0 select-none">{terminalPrompt()}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 bg-transparent text-on-surface outline-none caret-primary min-w-0"
                    aria-label="Terminal command input"
                />
            </form>
        </div>
    );
}
