import clsx from "clsx";

interface BurgerMenuIconProps {
    className?: string;
}

export const BurgerMenuIcon = ({ className }: BurgerMenuIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className={clsx("w-5 h-5", className)}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);