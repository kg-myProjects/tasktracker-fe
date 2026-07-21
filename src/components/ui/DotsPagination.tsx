interface DotsPaginationProps {
    total: number;
    activeIndex: number;
}

export function DotsPagination({total, activeIndex}: DotsPaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 mb-2">
            {Array.from({length: total}).map((_, index) => (
                <div
                    key={index}
                    className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${
                        index === activeIndex
                            ? "bg-cyan-400 scale-125 shadow-[0_0_8px_2px_rgba(34,211,238,0.8)]"
                            : "bg-slate-600"
                    }
                    `}
                />
            ))}
        </div>
    );
}