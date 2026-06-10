import { Globe, GitBranch, Copy, Trash2 } from 'lucide-react';
import { useContextMenu } from '../ui/useContextMenu';

export default function RemoteBranchRow({ branch, onCheckout, onCopy, onDelete }) {
    const onContextMenu = useContextMenu(() => [
        { id: 'checkout', label: 'Checkout', icon: GitBranch, onSelect: () => onCheckout(branch.name) },
        { separator: true },
        { id: 'copy', label: 'Copy branch name', icon: Copy, onSelect: () => onCopy(branch.name) },
        { id: 'delete', label: 'Delete remote branch', icon: Trash2, danger: true, onSelect: () => onDelete(branch.name) },
    ]);

    return (
        <div
            onContextMenu={onContextMenu}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors"
        >
            <Globe className="w-4 h-4 shrink-0 text-on-surface-variant/60" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
                <span className="text-[13.5px] font-semibold font-mono text-on-surface truncate block">
                    {branch.name}
                </span>
                <p className="text-[11.5px] text-on-surface-variant font-mono truncate mt-0.5">
                    <span className="text-on-surface-variant/50">{branch.lastCommit}</span>
                    {' · '}
                    {branch.message}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onCheckout(branch.name)}
                title="Checkout as local tracking branch"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all shrink-0"
            >
                <GitBranch className="w-3 h-3" strokeWidth={2} />
                Checkout
            </button>

            <span className="text-[11px] text-on-surface-variant/50 shrink-0 font-body w-20 text-right">{branch.date}</span>
        </div>
    );
}
