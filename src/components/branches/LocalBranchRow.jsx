import { clsx } from 'clsx';
import { GitBranch, ArrowRight, Check, GitMerge, Upload, Download, Copy, Trash2 } from 'lucide-react';
import { useContextMenu } from '../ui/useContextMenu';

export default function LocalBranchRow({
    branch,
    isCurrent,
    busy,
    onCheckout,
    onPush,
    onPull,
    onMerge,
    onCopy,
    onDelete,
}) {
    const onContextMenu = useContextMenu(() => [
        { id: 'checkout', label: 'Checkout', icon: GitBranch, disabled: isCurrent, onSelect: () => onCheckout(branch.name) },
        { id: 'merge', label: 'Merge into current branch', icon: GitMerge, disabled: isCurrent, onSelect: () => onMerge(branch.name) },
        { separator: true },
        {
            id: 'push',
            label: branch.tracking ? 'Push to origin' : 'Publish branch',
            icon: Upload,
            disabled: busy,
            onSelect: () => onPush(branch.name),
        },
        { id: 'pull', label: 'Pull', icon: Download, disabled: busy || !branch.tracking, onSelect: () => onPull(branch.name) },
        { separator: true },
        { id: 'copy', label: 'Copy branch name', icon: Copy, onSelect: () => onCopy(branch.name) },
        { id: 'delete', label: 'Delete branch', icon: Trash2, danger: true, disabled: isCurrent, onSelect: () => onDelete(branch.name) },
    ]);

    return (
        <div
            onContextMenu={onContextMenu}
            className={clsx(
                'group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isCurrent
                    ? 'bg-surface-container-high cursor-default'
                    : 'hover:bg-surface-container-low cursor-pointer',
            )}
            onClick={!isCurrent ? () => onCheckout(branch.name) : undefined}
        >
            <GitBranch
                className={clsx('w-4 h-4 shrink-0', isCurrent ? 'text-primary' : 'text-on-surface-variant')}
                strokeWidth={1.75}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={clsx(
                        'text-[13.5px] font-semibold font-mono truncate',
                        isCurrent ? 'text-primary' : 'text-on-surface',
                    )}>
                        {branch.name}
                    </span>
                    {isCurrent && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">
                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            HEAD
                        </span>
                    )}
                    {branch.tracking ? (
                        <span className="hidden group-hover:inline-flex items-center gap-1 text-[10px] text-on-surface-variant/60 font-body shrink-0">
                            <GitMerge className="w-3 h-3" strokeWidth={1.75} />
                            {branch.tracking}
                        </span>
                    ) : (
                        <span className="shrink-0 inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest text-on-surface-variant/70 px-2 py-0.5 rounded-full font-body">
                            local only
                        </span>
                    )}
                </div>
                <p className="text-[11.5px] text-on-surface-variant font-mono truncate mt-0.5">
                    <span className="text-on-surface-variant/50">{branch.lastCommit}</span>
                    {' · '}
                    {branch.message}
                </p>
            </div>

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPush(branch.name); }}
                disabled={busy}
                title={branch.tracking ? 'Push to origin' : 'Publish branch to origin'}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Upload className="w-3 h-3" strokeWidth={2} />
                {branch.tracking ? 'Push' : 'Publish'}
            </button>

            <span className="text-[11px] text-on-surface-variant/50 shrink-0 font-body w-20 text-right">{branch.date}</span>
            {!isCurrent && (
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity shrink-0" strokeWidth={2} />
            )}
        </div>
    );
}
