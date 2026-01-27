import NeonButton from "./NeonButton";

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
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-cyan-400/30 bg-black p-6 shadow-neon">
                <h2 className="mb-2 text-lg font-semibold text-cyan-300 text-neon">
                    {title}
                </h2>

                <p className="mb-6 text-sm text-gray-400">
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
                        variant="danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </NeonButton>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
