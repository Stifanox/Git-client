import clsx from 'clsx';
import { useMemo } from 'react';
import CodeLine from './CodeLine';
import DiffBlockGroup from './DiffBlockGroup';

function groupLinesForRender(lines) {
    const groups = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        if (!line.blockId) {
            groups.push({ blockId: null, lines: [line] });
            i += 1;
            continue;
        }

        const blockId = line.blockId;
        const blockLines = [line];
        i += 1;
        while (i < lines.length && lines[i].blockId === blockId) {
            blockLines.push(lines[i]);
            i += 1;
        }
        groups.push({ blockId, lines: blockLines });
    }

    return groups;
}

export default function CodePanel({
    title,
    titleClassName = 'text-on-surface-variant',
    headerClassName = 'bg-surface-container-high/50',
    lines,
    blockChoices,
    side,
    actionLabel,
    onAction,
    onApplyBlock,
    scrollRef,
    onScroll,
    activeBlockId,
}) {
    const groups = useMemo(() => groupLinesForRender(lines), [lines]);

    return (
        <section className="flex flex-col min-h-0 min-w-0 bg-[rgba(19,19,19,0.3)] border-l border-outline-variant/30 first:border-l-0 h-full">
            <header className={clsx(headerClassName, 'flex items-center justify-between px-3 py-3 shrink-0 z-10')}>
                <span className={clsx(titleClassName, 'text-[12px] font-bold tracking-[1.2px] uppercase font-body')}>
                    {title}
                </span>
                {actionLabel && (
                    <button
                        type="button"
                        onClick={onAction}
                        disabled={!activeBlockId}
                        className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-sm hover:bg-primary/20 transition-colors font-body disabled:opacity-40 disabled:pointer-events-none"
                        title="Apply entire active block from this side"
                    >
                        {actionLabel}
                    </button>
                )}
            </header>
            <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto min-h-0">
                <div className="min-w-max pt-4 pb-24">
                    {groups.map((group) => {
                        const blockChoice = group.blockId ? blockChoices[group.blockId] : null;
                        const isUnresolved = group.blockId && !blockChoice;
                        const isActive = group.blockId === activeBlockId;

                        return (
                            <DiffBlockGroup
                                key={group.blockId ?? group.lines[0].id}
                                blockId={group.blockId}
                                side={side}
                                isUnresolved={isUnresolved}
                                isActive={isActive}
                                onApplyBlock={onApplyBlock}
                            >
                                {group.lines.map((line) => {
                                    const blockResolved = blockChoice === side;
                                    return (
                                        <CodeLine
                                            key={line.id}
                                            lineNumber={line.line}
                                            content={line.content}
                                            type={line.type}
                                            blockResolved={blockResolved && line.isBlockStart}
                                        />
                                    );
                                })}
                            </DiffBlockGroup>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
