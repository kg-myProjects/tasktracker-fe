import clsx from "clsx";

interface ArrowIconProps {
    direction: "left" | "right";
    className?: string;
}

export const ArrowIcon = ({direction, className}: ArrowIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className={clsx("w-5 h-5", className)}
    >
        <path
            d={
                direction === "left"
                    ? "M15 18L9 12L15 6"
                    : "M9 6L15 12L9 18"
            }
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);