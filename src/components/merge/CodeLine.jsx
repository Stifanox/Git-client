import clsx from 'clsx';
import { Check } from 'lucide-react';

const lineStyles = {
    normal: 'border-l-4 border-transparent',
    changed: 'border-l-4 border-tertiary/80 bg-tertiary/10',
    conflict: 'border-l-4 border-primary bg-primary/10',
    applied: 'border-l-4 border-secondary bg-secondary/15',
};

const textStyles = {
    normal: 'text-on-surface',
    changed: 'text-on-surface',
    conflict: 'text-on-surface',
    applied: 'text-secondary',
};

export default function CodeLine({ lineNumber, content, type, blockResolved }) {
    return (
        <div
            data-line={lineNumber}
            className={clsx(
                'flex items-start min-h-[19.5px] shrink-0',
                lineStyles[type] ?? lineStyles.normal
            )}
        >
            <span className="w-7 shrink-0" aria-hidden />
            <span className="w-11 shrink-0 pr-3 text-right text-[12px] text-on-surface-variant font-body select-none tabular-nums">
                {lineNumber}
            </span>
            <code
                className={clsx(
                    'font-mono text-[13px] leading-[19.5px] whitespace-pre min-w-max pr-8',
                    textStyles[type] ?? textStyles.normal
                )}
            >
                {content || '\u00a0'}
            </code>
            {blockResolved && (
                <span className="ml-2 shrink-0 text-secondary" title="Block applied from this side">
                    <Check className="w-3 h-3" strokeWidth={3} />
                </span>
            )}
        </div>
    );
}
