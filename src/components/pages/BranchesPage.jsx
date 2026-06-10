import { useState } from 'react';
import { clsx } from 'clsx';
import { GitBranch, Plus, ArrowRight, Globe, Check, GitMerge } from 'lucide-react';
import { useGitStore } from '../../store/useGitStore.js';

function LocalBranchRow({ branch, isCurrent, onCheckout }) {
    return (
        <div
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
                    {branch.tracking && (
                        <span className="hidden group-hover:inline-flex items-center gap-1 text-[10px] text-on-surface-variant/60 font-body shrink-0">
                            <GitMerge className="w-3 h-3" strokeWidth={1.75} />
                            {branch.tracking}
                        </span>
                    )}
                </div>
                <p className="text-[11.5px] text-on-surface-variant font-mono truncate mt-0.5">
                    <span className="text-on-surface-variant/50">{branch.lastCommit}</span>
                    {' · '}
                    {branch.message}
                </p>
            </div>
            <span className="text-[11px] text-on-surface-variant/50 shrink-0 font-body">{branch.date}</span>
            {!isCurrent && (
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity shrink-0" strokeWidth={2} />
            )}
        </div>
    );
}

function RemoteBranchRow({ branch }) {
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

export default function BranchesPage() {
    const { HEAD, branches, checkout, createBranch } = useGitStore();
    const currentBranch = branches.local.find((b) => b.name === HEAD);

    const [showForm, setShowForm]         = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const handleCreate = () => {
        if (!newBranchName.trim()) return;
        createBranch(newBranchName.trim());
        setNewBranchName('');
        setShowForm(false);
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface h-screen selection:bg-primary/20">
            <header className="flex items-center justify-between px-12 py-8 shrink-0">
                <h2 className="text-[24px] font-extrabold text-on-surface tracking-editorial font-display">
                    Branches
                </h2>
                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="flex items-center gap-2 bg-primary hover:opacity-90 text-surface px-4 py-2 rounded-md font-bold text-[13.5px] transition-all font-body shadow-ambient"
                >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    New Branch
                </button>
            </header>

            <div className="px-12 pb-16 space-y-10 max-w-4xl">

                {showForm && (
                    <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-3">
                        <GitBranch className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                        <input
                            autoFocus
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')  handleCreate();
                                if (e.key === 'Escape') { setShowForm(false); setNewBranchName(''); }
                            }}
                            placeholder="feature/my-new-feature"
                            className="flex-1 bg-surface-container-lowest rounded-lg px-3 py-2 text-[13px] font-mono text-on-surface placeholder:text-on-surface-variant/35 outline-none focus:ring-1 focus:ring-primary/40"
                        />
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={!newBranchName.trim()}
                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-[13px] font-bold disabled:opacity-40 hover:bg-primary/20 transition-colors font-body"
                        >
                            Create &amp; Checkout
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setNewBranchName(''); }}
                            className="px-3 py-2 text-[13px] text-on-surface-variant hover:text-on-surface transition-colors font-body"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="bg-surface-container-low rounded-xl p-6">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-5">
                        Current Branch Head
                    </p>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <GitBranch className="w-7 h-7 text-primary" strokeWidth={1.4} />
                        </div>
                        <div>
                            <h3 className="text-[28px] font-extrabold text-primary tracking-editorial font-display leading-none">
                                {HEAD}
                            </h3>
                            {currentBranch && (
                                <p className="text-[12.5px] text-on-surface-variant font-mono mt-2">
                                    <span className="text-on-surface-variant/50">{currentBranch.lastCommit}</span>
                                    {' · '}
                                    {currentBranch.message}
                                    {' · '}
                                    {currentBranch.date}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <section>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-3">
                        Local &mdash; {branches.local.length}
                    </p>
                    <div className="space-y-0.5">
                        {branches.local.map((b) => (
                            <LocalBranchRow
                                key={b.name}
                                branch={b}
                                isCurrent={b.name === HEAD}
                                onCheckout={checkout}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-3 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                        Remote — Origin &mdash; {branches.remote.length}
                    </p>
                    <div className="space-y-0.5">
                        {branches.remote.map((b) => (
                            <RemoteBranchRow key={b.name} branch={b} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
