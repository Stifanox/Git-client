import { useRef, useMemo, useCallback } from 'react';

/**
 * Synchronizuje scroll pionowy i poziomy między panelami.
 */
export function useSyncedScroll(panelCount = 3) {
    const refs = useRef([]);
    const syncing = useRef(false);

    const { refCallbacks, scrollHandlers } = useMemo(() => {
        const refCallbacks = Array.from({ length: panelCount }, (_, index) => (el) => {
            refs.current[index] = el;
        });

        const scrollHandlers = Array.from({ length: panelCount }, (_, sourceIndex) => (event) => {
            if (syncing.current) return;
            syncing.current = true;

            const { scrollTop, scrollLeft } = event.currentTarget;

            refs.current.forEach((el, i) => {
                if (i === sourceIndex || !el) return;
                if (el.scrollTop !== scrollTop) el.scrollTop = scrollTop;
                if (el.scrollLeft !== scrollLeft) el.scrollLeft = scrollLeft;
            });

            requestAnimationFrame(() => {
                syncing.current = false;
            });
        });

        return { refCallbacks, scrollHandlers };
    }, [panelCount]);

    const scrollToLine = useCallback((lineNum) => {
        requestAnimationFrame(() => {
            refs.current.forEach((container) => {
                if (!container) return;
                const row = container.querySelector(`[data-line="${lineNum}"]`);
                row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }, []);

    return {
        scrollRef: (index) => refCallbacks[index],
        onScroll: (index) => scrollHandlers[index],
        scrollToLine,
    };
}
