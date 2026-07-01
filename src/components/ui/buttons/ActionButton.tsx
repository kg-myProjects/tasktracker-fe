import React from "react";

type Props = {
    className?: string;
    onClick: () => void;
    children: React.ReactNode;
};

export function ActionButton({className, onClick, children}: Props) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2
                bg-white/5 backdrop-blur-md
                rounded-lg
                border border-cyan-400/30
                text-[10px] md:text-[12px] text-white text-neon font-black uppercase
                hover:bg-cyan-400/10 hover:border-cyan-400
                transition-all
                ${className}
            `}
        >
            {children}
        </button>
    );
}