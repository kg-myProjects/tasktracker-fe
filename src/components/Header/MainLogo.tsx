export default function MainLogo() {
    return (
        <div className="flex items-center gap-2">
            {/* ANIMATED ICON */}
            <div className="relative flex items-center justify-center w-8 h-8 md:w-16 md:h-16 transition-all duration-500 hover:scale-[1.2]">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
                >
                    <circle cx="12" cy="12" r="10" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                </svg>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,1)]"
                >
                    <circle cx="12" cy="12" r="8" stroke="#22d3ee" strokeWidth="2" />
                    <path d="M12 8V12M12 12H16M12 12V16M12 12H8" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="2" fill="white" className="animate-pulse" />
                </svg>
            </div>

            {/* TEXT */}
            <span className="flex items-baseline text-2xl md:text-4xl tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,1)] transition-all duration-500 hover:scale-[1.2]">
                <span className="logo-wave-text font-black tracking-wider">
                    Tracker
                </span>
                <span className="text-cyan-400 font-black hover:text-white transition-all duration-500">
                    App
                </span>
            </span>
        </div>
    );
}