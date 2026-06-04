import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Grupa linii jednego hunka — po najechaniu pokazuje strzałkę apply (JetBrains-style).
 */
export default function DiffBlockGroup({
    blockId,
    side,
    isUnresolved,
    isActive,
    onApplyBlock,
    children,
}) {
    if (!blockId) {
        return <>{children}</>;
    }

    const applyButton = (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onApplyBlock(blockId);
            }}
            className={clsx(
                'flex items-center justify-center w-8 h-8 rounded-md',
                'bg-primary text-[#003d88] shadow-ambient',
                'opacity-0 group-hover/block:opacity-100 focus:opacity-100',
                'hover:scale-105 active:scale-95 transition-all'
            )}
            title={side === 'left' ? 'Apply this block from local' : 'Apply this block from incoming'}
            aria-label={side === 'left' ? 'Apply left block' : 'Apply right block'}
        >
            {side === 'left' ? (
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            ) : (
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            )}
        </button>
    );

    return (
        <div
            data-block-id={blockId}
            className={clsx(
                'relative group/block flex min-w-0',
                isUnresolved && 'hover:bg-primary/[0.04]',
                isActive && isUnresolved && 'bg-primary/[0.06]'
            )}
        >
            {isUnresolved && side === 'right' && (
                <div className="sticky left-0 z-20 shrink-0 w-10 flex items-center justify-center self-stretch">
                    {applyButton}
                </div>
            )}
            <div className="flex-1 min-w-0">{children}</div>
            {isUnresolved && side === 'left' && (
                <div className="sticky right-0 z-20 shrink-0 w-10 flex items-center justify-center self-stretch">
                    {applyButton}
                </div>
            )}
        </div>
    );
}
