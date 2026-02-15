import NeonButton from "./NeonButton";
import { createPortal } from 'react-dom';

type ConfirmModalProps = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal = ({
                          title = "Confirm action",
                          message,
                          confirmText = "Discard",
                          cancelText = "Cancel",
                          onConfirm,
                          onCancel,
                      }: ConfirmModalProps) => {
    const modalContent = (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-transparent" onClick={onCancel} />

            <div className="relative w-full max-w-md rounded-xl border border-cyan-400/30 bg-black p-6 shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-in zoom-in-95 duration-200">
                <h2 className="mb-2 text-lg font-bold uppercase tracking-tighter text-cyan-300 shadow-cyan-500/50">
                    {title}
                </h2>

                <p className="mb-6 text-sm text-gray-400 uppercase tracking-tight leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <NeonButton
                        size="sm"
                        variant="primary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </NeonButton>

                    <NeonButton
                        size="sm"
                        variant="warning"
                        onClick={onConfirm}
                        className="border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    >
                        {confirmText}
                    </NeonButton>
                </div>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

export default ConfirmModal;
