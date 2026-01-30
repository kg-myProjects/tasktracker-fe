import React from "react";

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    size?: "sm" | "md" | "lg";        // маленькая, средняя, большая
    variant?: "primary" | "warning" | "success"; // цвета
    className?: string;               // дополнительные кастомные классы
}

export const sizeClasses = {
    sm: "px-3 py-1 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl",
};

export const variantClasses = {
    primary: "text-cyan-200 border-cyan-300 hover:text-white hover:border-cyan-300",
    warning: "text-yellow-400 border-yellow-400/40 hover:text-white hover:border-yellow-400",
    success: "text-cyan-400 border-cyan-400/40 hover:text-white hover:border-cyan-400",
};

export type FieldType = "text" | "textarea" | "number" | "email" | "password";

export type FieldConfig = {
    name: string;
    label: string;
    placeholder?: string;
    type?: FieldType;
    validation?: Record<string, unknown>;
    rows?: number;
};




