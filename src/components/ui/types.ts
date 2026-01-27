export type NeonButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    size?: "sm" | "md" | "lg";        // маленькая, средняя, большая
    variant?: "primary" | "danger" | "success"; // цвета
    className?: string;               // дополнительные кастомные классы
};

export const sizeClasses = {
    sm: "px-3 py-1 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl",
};

export const variantClasses = {
    primary: "text-cyan-300 border-cyan-400/40 hover:text-white hover:border-cyan-300",
    danger: "text-red-400 border-red-400/40 hover:text-white hover:border-red-400",
    success: "text-green-400 border-green-400/40 hover:text-white hover:border-green-400",
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




