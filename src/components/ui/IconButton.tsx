// IconButton.tsx
interface IconButtonProps {
    icon: string;
    label: string;
    loading?: boolean;
    onClick: () => void;
}

export const IconButton = ({ icon, label, loading, onClick }: IconButtonProps) => (
    <button
        onClick={onClick}
        disabled={loading}
        className="w-full text-left px-4 py-3 bg-[#e8e9ec] hover:bg-[#dcdfe4] disabled:opacity-70 rounded-2xl text-[10px] font-black text-slate-600 flex items-center gap-3 transition-all group shadow-sm relative overflow-hidden"
    >
        {loading ? (
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        ) : (
            <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
        )}
        <span className={loading ? "opacity-50" : ""}>{label}</span>

        {loading && (
            <div className="absolute bottom-0 left-0 h-[2px] bg-cyan-500 animate-progress-fast w-full" />
        )}
    </button>
);
