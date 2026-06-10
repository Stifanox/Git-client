import { GitMerge, GitCommitVertical } from 'lucide-react';

export default function GraphNode({ isMerge, isLast, active }) {
    return (
        <span className="relative flex justify-center self-stretch w-full">
            {/* vertical line */}
            {!isLast && (
                <span className="absolute top-1/2 bottom-[-1.75rem] w-px bg-outline-variant/40" />
            )}
            <span className="absolute top-[-1.75rem] h-[1.75rem] w-px bg-outline-variant/40" />
            {/* node */}
            {isMerge ? (
                <GitMerge
                    className={`relative z-10 w-4 h-4 ${active ? 'text-primary' : 'text-on-surface-variant'}`}
                    strokeWidth={2.5}
                />
            ) : (
                <GitCommitVertical
                    className={`relative z-10 w-4 h-4 ${active ? 'text-primary' : 'text-on-surface-variant'}`}
                    strokeWidth={2.5}
                />
            )}
        </span>
    );
}
