import React from "react";
import {Link} from "react-router-dom";

type ButtonVariant = "primary" | "danger";

type MainButtonProps = {
    variant?: ButtonVariant;
    width?: number;
    to?: string;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function MainButton({children, variant = "primary", width, className = "", to, ...props}: MainButtonProps) {

    const baseStyles =
        "rounded-xl px-6 py-2.5 text-sm font-black text-white transition-all duration-300 ease-in-out hover:scale-[1.20]";

    const variantStyles = {
        primary:
            "bg-cyan-500 border border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.9)]",
        danger:
            "bg-red-500 border border-red-300/50 shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:bg-red-700 hover:shadow-[0_0_35px_rgba(239,68,68,0.9)]",
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={props.type ?? "button"} className={classes} style={width ? {width: `${width}px`} : undefined}{...props}>
            {children}
        </button>
    );
}