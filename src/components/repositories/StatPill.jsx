export default function StatPill({ icon: Icon, label, value, tone }) {
    const toneClass = tone === 'warn' ? 'text-tertiary' : 'text-on-surface-variant';
    return (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-body">
            <Icon className={`w-3.5 h-3.5 ${toneClass}`} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/70">
                {label}
            </span>
            <span className={`font-semibold font-mono ${toneClass}`}>{value}</span>
        </span>
    );
}
