import { useEffect, useRef, useState, useCallback } from "react";
import PulsedStripe from "../../../components/ui/PulsedStripe.tsx";
import MainButton from "../../../components/ui/buttons/MainButton.tsx";

export function TaskModal({
                              isOpen,
                              onClose,
                              onCreate,
                              statusName,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string) => void;
    statusName: string;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    // Используем useCallback, чтобы handleClose не пересоздавалась
    const handleClose = useCallback(() => {
        setTitle("");
        setDescription("");
        setError("");
        onClose();
    }, [onClose]);

    // Focus on title input when modal opens
    useEffect(() => {
        if (isOpen && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isOpen]);

    // Close modal on Esc
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [handleClose]);  // handleClose в зависимостях, чтобы использовать актуальную версию

    if (!isOpen) return null;

    const handleSubmit = () => {

        if (title.trim() === "") {
            setError("Title is required.");
            return;
        }

        // Clear error and call onCreate
        setError("");
        onCreate(title, description);
        setTitle("");
        setDescription("");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
             onClick={handleClose}>
            <div className="bg-slate-900 w-96 text-white border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-xl">
                    <h2 className="h-20 flex items-center justify-center text-xl font-bold text-white text-neon-strong uppercase">Add Task to {statusName}</h2>
                    <PulsedStripe height="2px"></PulsedStripe>
                </div>
                <div className="p-4">
                    <input
                    ref={titleRef}
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl ${
                        error ? "border-red-500" : "border-cyan-500/20"
                    }`}
                />
                    <textarea
                        placeholder="Description (optional, max 200 chars)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl ${
                            error && description.length > 200 ? "border-red-500" : "border-cyan-500/20"
                        }`}
                    />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <div className="flex justify-end">
                        <MainButton onClick={handleSubmit}>
                            Add
                        </MainButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
