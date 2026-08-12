import NeonButton from "./buttons/NeonButton.tsx";
import { createPortal } from 'react-dom';

type ConfirmModalProps = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

const ConfirmModal = ({
                          title = "Confirm action",
                          message,
                          confirmText = "Discard",
                          cancelText = "Cancel",
                          onConfirm,
                          onCancel,
                          isLoading = false,
                      }: ConfirmModalProps) => {
    const modalContent = (
        <div className="flex fixed inset-0 z-[200] items-center justify-center animate-in fade-in duration-300 bg-black/60">
            <div className="absolute inset-0 bg-transparent" onClick={onCancel} />

            <div className="p-4 relative w-full max-w-md rounded-xl border border-dark-accent/30 bg-secondary-dark shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-in zoom-in-95 duration-300">
                <h2 className="mb-2 text-lg text-accent font-bold uppercase tracking-tighter">
                    {title}
                </h2>
                <p className="mb-6 text-sm text-text-muted tracking-tight leading-relaxed">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <NeonButton
                        size="sm"
                        variant="primary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </NeonButton>

                    <NeonButton
                        size="sm"
                        variant="warning"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="border-danger-red text-danger-red shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-3 w-3 text-danger-red" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            confirmText
                        )}
                    </NeonButton>
                </div>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

export default ConfirmModal;