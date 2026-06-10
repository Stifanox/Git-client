import { clsx } from 'clsx';
import { CheckCircle2, Info, AlertTriangle, Loader2, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore.js';

const toneConfig = {
    success: { icon: CheckCircle2, accent: 'text-secondary' },
    info: { icon: Info, accent: 'text-primary' },
    warn: { icon: AlertTriangle, accent: 'text-tertiary' },
    error: { icon: AlertTriangle, accent: 'text-tertiary' },
    loading: { icon: Loader2, accent: 'text-primary' },
};

/**
 * Globalny kontener toastów. Montowany raz (AppLayout), nasłuchuje
 * `useToastStore` i renderuje powiadomienia w prawym dolnym rogu.
 */
export default function ToastViewport() {
    const toasts = useToastStore((s) => s.toasts);
    const dismissToast = useToastStore((s) => s.dismissToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex w-[340px] flex-col gap-2.5">
            {toasts.map((t) => {
                const cfg = toneConfig[t.tone] ?? toneConfig.info;
                const Icon = cfg.icon;
                return (
                    <div
                        key={t.id}
                        role="status"
                        className="flex items-start gap-3 rounded-bento bg-surface-container-highest px-4 py-3 shadow-ambient ring-1 ring-outline-variant/30 font-body animate-[fadeIn_120ms_ease-out]"
                    >
                        <Icon
                            className={clsx('mt-0.5 h-4 w-4 shrink-0', cfg.accent, t.tone === 'loading' && 'animate-spin')}
                            strokeWidth={2}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-on-surface">{t.title}</p>
                            {t.description && (
                                <p className="mt-0.5 break-words text-[12px] text-on-surface-variant">{t.description}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => dismissToast(t.id)}
                            aria-label="Dismiss"
                            className="shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
                        >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
