import { clsx } from 'clsx';
import { FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DiffViewer({ file }) {
    if (!file) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                <FileText className="w-10 h-10 opacity-20" strokeWidth={1.25} />
                <p className="text-[13px] font-body">Select a file to view diff</p>
            </div>
        );
    }

    const statusLabel = { M: 'Modified', A: 'Added', D: 'Deleted' }[file.status] ?? file.status;
    const addedCount   = file.diff.filter((l) => l.type === 'added').length;
    const removedCount = file.diff.filter((l) => l.type === 'removed').length;

    let leftLn = 1;
    let rightLn = 1;
    const linesWithNumbers = file.diff.map((line) => {
        const l = line.type !== 'added'   ? leftLn  : null;
        const r = line.type !== 'removed' ? rightLn : null;
        if (line.type !== 'added')   leftLn++;
        if (line.type !== 'removed') rightLn++;
        return { ...line, l, r };
    });

    return (
        <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex items-center gap-4 px-6 py-3.5 shrink-0 border-b border-outline-variant">
                <StatusBadge status={file.status} />
                <span className="text-[13px] font-mono text-on-surface flex-1 truncate">{file.path}</span>
                <span className="text-[11px] text-on-surface-variant font-body shrink-0">{statusLabel}</span>
                {addedCount > 0 && (
                    <span className="text-[11px] font-bold text-secondary font-mono">+{addedCount}</span>
                )}
                {removedCount > 0 && (
                    <span className="text-[11px] font-bold text-tertiary font-mono">-{removedCount}</span>
                )}
            </div>

            <div className="font-mono text-[12.5px] flex-1">
                {linesWithNumbers.map((line, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'flex py-px select-text',
                            line.type === 'added'   && 'bg-secondary/8 text-secondary',
                            line.type === 'removed' && 'bg-tertiary/8 text-tertiary',
                            line.type === 'context' && 'text-on-surface-variant',
                        )}
                    >
                        <span className="w-10 shrink-0 text-right pr-3 select-none text-on-surface-variant/25 text-[11px] leading-[1.7]">
                            {line.l ?? ''}
                        </span>
                        <span className="w-10 shrink-0 text-right pr-4 select-none text-on-surface-variant/25 text-[11px] leading-[1.7]">
                            {line.r ?? ''}
                        </span>
                        <span className="w-4 shrink-0 select-none opacity-40 text-center">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                        </span>
                        <span className="whitespace-pre pr-6">{line.content || ' '}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
