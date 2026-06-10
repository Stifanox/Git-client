export default function ToolbarButton({ icon: Icon, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-display"
        >
            <Icon className="w-4 h-4" strokeWidth={2} />
            <span className="hidden lg:inline">{label}</span>
        </button>
    );
}
