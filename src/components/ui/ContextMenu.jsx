import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { useContextMenuStore } from '../../store/useContextMenuStore.js';

/**
 * Globalny renderer menu kontekstowego. Montowany raz (AppLayout), reaguje na
 * stan z `useContextMenuStore`. Pozycję kursora klamruje do widocznego obszaru,
 * a menu zamyka klik poza nim, Escape oraz scroll/resize.
 */
export default function ContextMenu() {
    const open = useContextMenuStore((s) => s.open);
    const x = useContextMenuStore((s) => s.x);
    const y = useContextMenuStore((s) => s.y);
    const items = useContextMenuStore((s) => s.items);
    const closeMenu = useContextMenuStore((s) => s.closeMenu);

    const ref = useRef(null);
    const [pos, setPos] = useState({ x, y });

    useLayoutEffect(() => {
        if (!open || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        let nx = x;
        let ny = y;
        if (x + rect.width > innerWidth - 8) nx = innerWidth - rect.width - 8;
        if (y + rect.height > innerHeight - 8) ny = innerHeight - rect.height - 8;
        setPos({ x: Math.max(8, nx), y: Math.max(8, ny) });
    }, [open, x, y, items]);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) closeMenu();
        };
        const onKey = (e) => {
            if (e.key === 'Escape') closeMenu();
        };
        const onViewportChange = () => closeMenu();

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onViewportChange);
        window.addEventListener('scroll', onViewportChange, true);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onViewportChange);
            window.removeEventListener('scroll', onViewportChange, true);
        };
    }, [open, closeMenu]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            role="menu"
            style={{ top: pos.y, left: pos.x }}
            onContextMenu={(e) => e.preventDefault()}
            className="fixed z-50 min-w-[210px] py-1.5 rounded-bento bg-surface-container-highest shadow-ambient ring-1 ring-outline-variant/30 font-body select-none animate-[fadeIn_80ms_ease-out]"
        >
            {items.map((item, i) => {
                if (item.separator) {
                    return <div key={`sep-${i}`} className="my-1 h-px bg-outline-variant/20" />;
                }

                const Icon = item.icon;
                return (
                    <button
                        key={item.id ?? i}
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        onClick={() => {
                            closeMenu();
                            item.onSelect?.();
                        }}
                        className={clsx(
                            'flex w-full items-center gap-3 px-3 py-1.5 text-left text-[13px] transition-colors',
                            item.disabled
                                ? 'text-on-surface-variant/35 cursor-not-allowed'
                                : item.danger
                                  ? 'text-tertiary hover:bg-tertiary/10'
                                  : 'text-on-surface hover:bg-surface-container-high',
                        )}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />}
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hint && (
                            <span className="text-[11px] text-on-surface-variant/50 font-mono shrink-0">{item.hint}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
