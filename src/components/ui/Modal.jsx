import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all">
            <div className="bg-surface-container-highest w-full max-w-md rounded-bento shadow-ambient overflow-hidden flex flex-col border border-white/10">

                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="text-[15px] font-bold text-on-surface font-display tracking-tight">{title}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <X className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}