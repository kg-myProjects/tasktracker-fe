import clsx from "clsx";

interface TrashIconProps {
    className?: string;
}

export const TrashIcon = ({className}: TrashIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className={clsx("w-4 h-4", className)}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 6h18"/>
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
    </svg>
);