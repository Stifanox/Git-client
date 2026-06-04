import { GitBranch, RefreshCw } from 'lucide-react';

export default function MergeFooter({ branch, lastSync, cursor }) {
    return (
        <footer className="shrink-0 h-8 bg-[#191a1a] border-t border-outline-variant/30 flex items-center justify-between px-6 text-[10px] text-on-surface-variant font-body">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <GitBranch className="w-2.5 h-2.5" strokeWidth={2} />
                    {branch}
                </span>
                <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-2 h-2" strokeWidth={2} />
                    Last sync: {lastSync}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>Spaces: 2</span>
                <span>Line {cursor.line}, Col {cursor.col}</span>
                <span className="text-secondary font-bold">● System Ready</span>
            </div>
        </footer>
    );
}
