import {ArrowIcon} from "./icons/ArrowIcon";

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

const ArrowButton = ({direction, disabled, onClick}: ArrowButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-10 h-10
        flex items-center justify-center
        rounded bg-secondary-dark shadow-md
        hover:bg-surface-dark
        hover:shadow-lg
        active:scale-95
        active:shadow-sm
        active:translate-y-0.5
        cursor-pointer
        disabled:opacity-40
        disabled:cursor-not-allowed
        transition duration-200"
    >
        <ArrowIcon
            direction={direction}
            className="text-accent"
        />
    </button>
);

const Pagination = ({currentPage, totalPages, onPageChange}: PaginationProps) => {

    if (totalPages <= 1) return null;

    return (
        <div
            className="flex items-center justify-center gap-2 px-6 py-4 border-t border-dark-accent/30 hover:border-dark-accent">
            <ArrowButton
                direction="left"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />
            <div className="w-[100px] flex items-center justify-center text-accent tabular-nums">
                {currentPage} of {totalPages}
            </div>
            <ArrowButton
                direction="right"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </div>
    );
};

export default Pagination;