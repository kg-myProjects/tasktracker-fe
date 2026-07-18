import clsx from "clsx";

type CrownIconProps = {
    className?: string;
};

export const CrownIcon = ({className}: CrownIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={clsx("w-4 h-4", className)}
    >
        <path d="M2 19h20v2H2v-2zM2 6l5 5 5-8 5 8 5-5v11H2V6z"/>
    </svg>
);