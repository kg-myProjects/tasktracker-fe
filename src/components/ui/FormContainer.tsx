import React from "react";
import NeonButton from "./NeonButton";

type FormContainerProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    onClose: () => void;
    submitButton?: React.ReactNode; // можно передать кастомную кнопку submit
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
        <div className="relative mx-auto max-w-md p-6 mt-10 rounded-xl border border-cyan-400/40 bg-black shadow-neon">
            {/* Close button */}
            <NeonButton
                size="sm"
                variant="danger"
                onClick={onClose}
                className="absolute top-4 right-4"
            >
                ×
            </NeonButton>

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
