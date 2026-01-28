import {type NeonButtonProps, sizeClasses, variantClasses} from "./types.ts";

const NeonButton = ({
                        children,
                        onClick,
                        type = "button",
                        disabled = false,
                        size = "md",
                        variant = "primary",
                        className = "",
                    }: NeonButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative overflow-hidden
        bg-black
        border
        text-neon
        logo-wave-text
        transition-all duration-300
        disabled:opacity-40
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
        >
            <span className="relative z-10">{children}</span>

            {!disabled && (
                <span
                    className="
            pointer-events-none
            absolute inset-0 z-0
            bg-gradient-to-r from-transparent via-current/40 to-transparent
            animate-pulse-flow
          "
                />
            )}
        </button>
    );
};

export default NeonButton;
