import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Plus, Globe, Upload, Loader2 } from 'lucide-react';
import { useGitStore } from '../../store/useGitStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import LocalBranchRow from '../branches/LocalBranchRow';
import RemoteBranchRow from '../branches/RemoteBranchRow';

export default function BranchesPage() {
    const navigate = useNavigate();
    const {
        HEAD, branches, networkStatus,
        checkout, createBranch, push, pull, checkoutRemote, deleteBranch, deleteRemoteBranch,
    } = useGitStore();
    const addToast = useToastStore((s) => s.addToast);
    const currentBranch = branches.local.find((b) => b.name === HEAD);
    const busy = networkStatus !== 'idle';

    const [showForm, setShowForm]         = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const handleCreate = () => {
        if (!newBranchName.trim()) return;
        createBranch(newBranchName.trim());
        setNewBranchName('');
        setShowForm(false);
    };

    const handleCopy = async (name) => {
        try {
            await navigator.clipboard.writeText(name);
            addToast({ tone: 'info', title: 'Copied to clipboard', description: name });
        } catch {
            addToast({ tone: 'warn', title: 'Copy failed', description: name });
        }
    };

    const handleMerge = (name) => {
        navigate('/merge');
        addToast({ tone: 'info', title: `Merging ${name} → ${HEAD}`, description: 'Opening Visual Merge Tool…' });
    };

    const handlePush = async (name) => {
        const result = await push(name);
        if (result?.conflict) {
            navigate('/merge');
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface h-screen selection:bg-primary/20">
            <header className="flex items-center justify-between px-12 py-8 shrink-0">
                <h2 className="text-[24px] font-extrabold text-on-surface tracking-editorial font-display">
                    Branches
                </h2>
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => handlePush(HEAD)}
                        disabled={busy}
                        title={currentBranch?.tracking ? `Push ${HEAD} to origin` : `Publish ${HEAD} to origin`}
                        className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded-md font-bold text-[13.5px] transition-all font-body disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                        ) : (
                            <Upload className="w-4 h-4" strokeWidth={2} />
                        )}
                        {currentBranch?.tracking ? 'Push' : 'Publish'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm((v) => !v)}
                        className="flex items-center gap-2 bg-primary hover:opacity-90 text-surface px-4 py-2 rounded-md font-bold text-[13.5px] transition-all font-body shadow-ambient"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        New Branch
                    </button>
                </div>
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
                                busy={busy}
                                onCheckout={checkout}
                                onPush={handlePush}
                                onPull={pull}
                                onMerge={handleMerge}
                                onCopy={handleCopy}
                                onDelete={deleteBranch}
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
                            <RemoteBranchRow
                                key={b.name}
                                branch={b}
                                onCheckout={checkoutRemote}
                                onCopy={handleCopy}
                                onDelete={deleteRemoteBranch}
                            />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
