export default function SettingsSection({ title, description, children, className = "" }) {
    return (
        <section className={`flex flex-col lg:flex-row gap-8 lg:gap-16 ${className}`}>
            {/* Lewa kolumna: Opis sekcji */}
            <div className="w-full lg:w-1/3 shrink-0">
                <h3 className="text-[16px] font-bold text-on-surface mb-2 font-display">
                    {title}
                </h3>
                <p className="text-[13.5px] text-on-surface-variant leading-relaxed font-body pr-4">
                    {description}
                </p>
            </div>

            {/* Prawa kolumna: Dynamiczny content (Bento Box, Inputy, itd.) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-5">
                {children}
            </div>
        </section>
    );
}