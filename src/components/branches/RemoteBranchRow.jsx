import { Globe } from 'lucide-react';

export default function RemoteBranchRow({ branch }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-default">
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
            <span className="text-[11px] text-on-surface-variant/50 shrink-0 font-body">{branch.date}</span>
        </div>
    );
}
