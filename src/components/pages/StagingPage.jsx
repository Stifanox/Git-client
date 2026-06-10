import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, RotateCcw, GitCommit, Upload } from 'lucide-react';
import { useGitStore } from '../../store/useGitStore.js';
import FileRow from '../staging/FileRow';
import DiffViewer from '../staging/DiffViewer';

export default function StagingPage() {
    const navigate = useNavigate();
    const {
        HEAD, unstaged, staged,
        stage, unstage, discard, stageAll, unstageAll,
        commit, commitAndPush, networkStatus,
    } = useGitStore();

    const [selectedId, setSelectedId] = useState(() => unstaged[0]?.id ?? staged[0]?.id ?? null);
    const [commitMsg, setCommitMsg]   = useState('');

    const allFiles     = [...unstaged, ...staged];
    const selectedFile = allFiles.find((f) => f.id === selectedId) ?? null;
    const isUnstaged   = (id) => unstaged.some((f) => f.id === id);
    const isStaged     = (id) => staged.some((f) => f.id === id);

    const handleDiscard = (id) => {
        discard(id);
        if (selectedId === id) setSelectedId(unstaged.find((f) => f.id !== id)?.id ?? staged[0]?.id ?? null);
    };

    const handleCommit = () => {
        commit(commitMsg);
        setCommitMsg('');
        setSelectedId(null);
    };

    const handleCommitAndPush = async () => {
        const result = await commitAndPush(commitMsg);
        if (!result?.ok) return;
        setCommitMsg('');
        setSelectedId(null);
        if (result.conflict) {
            navigate('/merge');
        }
    };

    const busy = networkStatus !== 'idle';

    return (
        <div className="flex h-full bg-surface overflow-hidden">

            {/* Left panel: file list + commit */}
            <aside className="w-72 flex flex-col bg-surface-container-low shrink-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">

                    <div className="px-4 pt-6 pb-2 flex items-center justify-between">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant font-body">
                            Unstaged {unstaged.length > 0 && <span className="text-on-surface">{unstaged.length}</span>}
                        </span>
                        {unstaged.length > 0 && (
                            <button
                                type="button"
                                onClick={stageAll}
                                className="text-[11px] font-semibold text-primary hover:opacity-75 transition-opacity font-body"
                            >
                                Stage All
                            </button>
                        )}
                    </div>
                    <div className="px-2 pb-3 space-y-0.5">
                        {unstaged.length === 0 ? (
                            <p className="px-3 py-2 text-[12px] text-on-surface-variant/40 font-body">No unstaged changes</p>
                        ) : (
                            unstaged.map((f) => (
                                <FileRow
                                    key={f.id}
                                    file={f}
                                    isSelected={selectedId === f.id}
                                    onSelect={setSelectedId}
                                    onAction={stage}
                                    ActionIcon={Plus}
                                    actionTitle="Stage file"
                                />
                            ))
                        )}
                    </div>

                    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant font-body">
                            Staged {staged.length > 0 && <span className="text-on-surface">{staged.length}</span>}
                        </span>
                        {staged.length > 0 && (
                            <button
                                type="button"
                                onClick={unstageAll}
                                className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors font-body"
                            >
                                Unstage All
                            </button>
                        )}
                    </div>
                    <div className="px-2 pb-4 space-y-0.5">
                        {staged.length === 0 ? (
                            <p className="px-3 py-2 text-[12px] text-on-surface-variant/40 font-body">No staged files</p>
                        ) : (
                            staged.map((f) => (
                                <FileRow
                                    key={f.id}
                                    file={f}
                                    isSelected={selectedId === f.id}
                                    onSelect={setSelectedId}
                                    onAction={unstage}
                                    ActionIcon={Minus}
                                    actionTitle="Unstage file"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Commit box */}
                <div className="shrink-0 p-4 border-t border-outline-variant">
                    <textarea
                        value={commitMsg}
                        onChange={(e) => setCommitMsg(e.target.value)}
                        placeholder="Commit message..."
                        rows={3}
                        className="w-full bg-surface-container-lowest rounded-lg px-3 py-2.5 text-[12.5px] font-mono text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
                    />
                    <div className="mt-2.5 flex gap-2">
                        <button
                            type="button"
                            onClick={handleCommit}
                            disabled={staged.length === 0 || !commitMsg.trim()}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container-highest disabled:opacity-30 hover:bg-surface-container-high disabled:cursor-not-allowed text-on-surface px-3 py-2.5 rounded-md font-bold text-[12px] transition-all font-body"
                        >
                            <GitCommit className="w-3.5 h-3.5" strokeWidth={2} />
                            Commit{staged.length > 0 ? ` (${staged.length})` : ''}
                        </button>
                        <button
                            type="button"
                            onClick={handleCommitAndPush}
                            disabled={staged.length === 0 || !commitMsg.trim() || busy}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary disabled:opacity-30 hover:opacity-90 disabled:cursor-not-allowed text-surface px-3 py-2.5 rounded-md font-bold text-[12px] transition-all font-body shadow-ambient"
                        >
                            <Upload className="w-3.5 h-3.5" strokeWidth={2} />
                            Commit &amp; Push
                        </button>
                    </div>
                </div>
            </aside>

            {/* Right panel: diff viewer */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-8 py-5 shrink-0">
                    <div>
                        <h2 className="text-[22px] font-extrabold text-on-surface tracking-editorial font-display">
                            Staging Area
                        </h2>
                        <p className="text-[12px] text-on-surface-variant mt-0.5 font-body">
                            <span className="font-mono text-primary">{HEAD}</span>
                            {' · '}
                            {unstaged.length} unstaged &nbsp;·&nbsp; {staged.length} staged
                        </p>
                    </div>

                    {selectedFile && (
                        <div className="flex items-center gap-2">
                            {isUnstaged(selectedFile.id) && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleDiscard(selectedFile.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-tertiary hover:bg-tertiary/10 transition-colors font-body"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                                        Discard
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => stage(selectedFile.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-body"
                                    >
                                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                        Stage File
                                    </button>
                                </>
                            )}
                            {isStaged(selectedFile.id) && (
                                <button
                                    type="button"
                                    onClick={() => unstage(selectedFile.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors font-body"
                                >
                                    <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                                    Unstage
                                </button>
                            )}
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-hidden mx-6 mb-6 bg-surface-container-low rounded-xl flex flex-col">
                    <DiffViewer file={selectedFile} />
                </div>
            </main>
        </div>
    );
}
