import clsx from 'clsx';
import { useState } from 'react';

const lineStyles = {
    normal: 'border-l-4 border-transparent',
    changed: 'border-l-4 border-tertiary/80 bg-tertiary/10',
    conflict: 'border-l-4 border-primary bg-primary/10',
    'resolved-result': 'border-l-4 border-transparent bg-[rgba(0,69,45,0.2)]',
};

export default function MergedLineRow({ lineNumber, content, type, onChange, onFocus, onBlur }) {
    const [focused, setFocused] = useState(false);

    return (
        <div
            data-line={lineNumber}
            className={clsx(
                'flex items-start min-h-[19.5px] shrink-0',
                focused ? 'border-l-4 border-transparent' : (lineStyles[type] ?? lineStyles.normal)
            )}
        >
            <span className="w-7 shrink-0" aria-hidden />
            <span className="w-11 shrink-0 pr-3 text-right text-[12px] text-on-surface-variant font-body select-none tabular-nums pt-px">
                {lineNumber}
            </span>
            <input
                type="text"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => {
                    setFocused(true);
                    onFocus?.();
                }}
                onBlur={() => {
                    setFocused(false);
                    onBlur?.();
                }}
                spellCheck={false}
                className={clsx(
                    'flex-1 min-w-[320px] bg-transparent border-0 outline-none',
                    'font-mono text-[13px] leading-[19.5px] text-on-surface',
                    'rounded-sm px-1 -mx-1',
                    focused && 'ring-1 ring-primary/40 bg-surface-container-low/40',
                    type === 'resolved-result' && !focused && 'text-secondary'
                )}
            />
        </div>
    );
}
