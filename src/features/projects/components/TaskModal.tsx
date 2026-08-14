import {useEffect, useRef, useState, useCallback} from "react";
import PulsedStripe from "../../../components/ui/effects/PulsedStripe.tsx";
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
            <div className="bg-main-dark w-96 text-white border border-dark-accent/30 hover:border-dark-accent rounded-xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-main-dark via-dark-accent to-main-dark rounded-t-xl">
                    <h2 className="h-20 flex items-center justify-center text-xl font-bold text-white text-neon-strong uppercase">Add Task to {statusName}</h2>
                    <PulsedStripe height="3px"/>
                </div>
                <div className="p-4">
                    <input
                    ref={titleRef}
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 mb-3 border border-dark-accent/30 hover:border-dark-accent focus:outline-none focus:border-accent rounded-xl ${
                        error ? "border-danger-red" : "border-dark-accent/30"
                    }`}
                />
                    <textarea
                        placeholder="Description (optional, max 200 chars)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full px-3 py-2 mb-3 border border-dark-accent/30 hover:border-dark-accent focus:outline-none focus:border-accent rounded-xl ${
                            error && description.length > 200 ? "border-danger-red" : "border-dark-accent/30"
                        }`}
                    />
                    {error && <p className="text-danger-red text-sm mb-3">{error}</p>}
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