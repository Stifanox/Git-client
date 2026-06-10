export default function Avatar({ initials }) {
    return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface font-body shrink-0">
            {initials}
        </span>
    );
}
