import React from "react";
import NeonButton from "./NeonButton";

type FormContainerProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    onClose: () => void;
    submitButton?: React.ReactNode;
    errorMessage?: string;
};

const FormContainer = ({
                           title,
                           description,
                           children,
                           onClose,
                           submitButton,
                           errorMessage,
                       }: FormContainerProps) => {
    return (
        <div className="relative mx-auto max-w-md p-6 rounded-xl bg-white/5 backdrop-blur-md  border-2 border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all   font-bold">
            {/* Close button */}
            <div className="absolute top-2 right-2">
            <NeonButton
                size="sm"
                variant="warning"
                onClick={onClose}
            >
                ×
            </NeonButton>
            </div>

            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-cyan-300 text-neon tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-gray-400">{description}</p>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="rounded-md bg-red-50/20 p-3 text-sm text-red-400 border border-red-400/30">
                        {errorMessage}
                    </div>
                )}
            </div>

            {/* Form content */}
            <div className="mt-6 space-y-4">{children}</div>

            {/* Submit button */}
            {submitButton && <div className="mt-4">{submitButton}</div>}
        </div>
    );
};

export default FormContainer;
