export default function ConflictOverlay({ line, conflictLabel, onDismiss }) {
    return (
        <div className="sticky bottom-6 left-4 right-4 z-10 mx-4 mt-4 pointer-events-none">
            <div className="pointer-events-auto backdrop-blur-md bg-surface-container-highest border border-outline-variant/30 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] px-6 py-4 flex flex-col gap-3">
                <h4 className="text-[12px] font-bold text-primary tracking-wide font-body">
                    UNRESOLVED BLOCK AT LINE {line}
                </h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed font-body">
                    {conflictLabel}
                    <br />
                    Use <strong className="text-on-surface">Accept Left</strong> or <strong className="text-on-surface">Accept Right</strong> to apply the whole block, or edit lines in Merged Result.
                </p>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface self-start font-body"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}
