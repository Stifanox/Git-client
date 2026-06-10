export default function DiffLine({ row }) {
    const sign = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' ';
    const rowClass =
        row.type === 'added'
            ? 'bg-secondary/[0.08] text-secondary'
            : row.type === 'removed'
              ? 'bg-tertiary/[0.08] text-tertiary'
              : 'text-on-surface-variant';
    return (
        <div className={`flex items-start gap-3 px-3 py-0.5 text-[12px] font-mono leading-relaxed ${rowClass}`}>
            <span className="w-8 text-right text-on-surface-variant/50 select-none shrink-0">{row.line}</span>
            <span className="w-3 select-none shrink-0">{sign}</span>
            <span className="whitespace-pre">{row.content}</span>
        </div>
    );
}
