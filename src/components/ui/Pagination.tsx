import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface ArrowButtonProps {
    direction: "left" | "right";
    disabled: boolean;
    onClick: () => void;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({direction, disabled, onClick}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
    >
        <svg
            className="w-5 h-5 text-cyan-400"
            viewBox="0 0 24 24"
            fill="none"
        >
            {direction === "left" ? (
                <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : (
                <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </svg>
    </button>
);

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                               }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-cyan-500/20 hover:border-cyan-500/40">
            <ArrowButton
                direction="left"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />

            <span className="text-cyan-400">
                {currentPage} of {totalPages}
            </span>

            <ArrowButton
                direction="right"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </div>
    );
};

export default Pagination;