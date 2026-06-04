export default function TextInput({ label, value, onChange, disabled, type = 'text' }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[11px] font-bold text-on-surface-variant mb-2 uppercase tracking-[0.08em] font-body">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-surface-container-lowest text-on-surface text-[13.5px] font-body px-4 py-2.5 rounded-md border-b-2 border-transparent focus:outline-none focus:border-primary transition-all"
            />
        </div>
    );
}