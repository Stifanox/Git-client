import { clsx } from 'clsx';
import StatusBadge from './StatusBadge';

export default function FileRow({ file, isSelected, onSelect, onAction, ActionIcon, actionTitle }) {
    return (
        <div
            className={clsx(
                'group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                isSelected ? 'bg-surface-container-highest' : 'hover:bg-surface-container-high',
            )}
            onClick={() => onSelect(file.id)}
        >
            <StatusBadge status={file.status} />
            <span className="flex-1 text-[12px] font-mono text-on-surface-variant truncate" title={file.path}>
                {file.path}
            </span>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAction(file.id); }}
                title={actionTitle}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded text-on-surface-variant hover:text-on-surface transition-all shrink-0"
            >
                <ActionIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
        </div>
    );
}
