import {type NeonButtonProps, sizeClasses, variantClasses} from "./types.ts";

const NeonButton = ({
                        children,
                        isLoading,
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
            disabled={isLoading || disabled}

            className={`
        relative overflow-hidden
        bg-black
        border
        text-neon
        logo-wave-text
        transition-all duration-300
        flex items-center justify-center
        disabled:opacity-40
        cursor-pointer
        hover:brightness-150 
        hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
        >
  <span className={`relative z-10 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </span>

            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center z-20">
                    <div
                        className="w-5 h-5 border-2 border-cyan-200 border-t-transparent rounded-full animate-spin"></div>
                </span>
            )}

            {!disabled && !isLoading && (
                <span
                    className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-current/40 to-transparent animate-pulse-flow"/>
            )}        </button>
    );
};

export default NeonButton;
