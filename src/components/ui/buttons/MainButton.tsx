import React from "react";
import {Link} from "react-router-dom";

type ButtonVariant = "primary" | "danger";

type MainButtonProps = {
    variant?: ButtonVariant;
    compactOnMobile?: boolean;
    to?: string;
    className?: string;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function MainButton({
                                       variant = "primary",
                                       compactOnMobile = false,
                                       to,
                                       className = "",
                                       children,
                                       ...props}: MainButtonProps) {

    const baseStyles = "rounded-[5px] font-inter font-medium text-white transition-all duration-300 ease-in-out hover:scale-[1.1]";

    const sizeStyles = compactOnMobile
        ? "px-[8px] py-[4px] text-[10px] md:px-[20px] md:py-[12px] md:text-sm"
        : "px-[20px] py-[12px] text-sm";

    const variantStyles = {
        primary:
            "bg-dark-accent hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]",
        danger:
            "bg-danger-red hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    };

    const classes = `${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={props.type ?? "button"} className={classes} {...props}>
            {children}
        </button>
    );
};