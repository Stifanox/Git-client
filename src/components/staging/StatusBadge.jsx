import { clsx } from 'clsx';

export default function StatusBadge({ status }) {
    const cls = {
        M: 'bg-primary/15 text-primary',
        A: 'bg-secondary/15 text-secondary',
        D: 'bg-tertiary/15 text-tertiary',
    }[status] ?? 'bg-surface-container-high text-on-surface-variant';

    return (
        <span className={clsx('inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-extrabold font-mono shrink-0', cls)}>
            {status}
        </span>
    );
}
