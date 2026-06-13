import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../../app/hooks";
import {selectIsLoading} from "../../statuses/slice/taskStatusSlice";
import PulsedStripe from "../../../components/ui/PulsedStripe.tsx";
import MainButton from "../../../components/ui/buttons/MainButton.tsx";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, position: number) => void;
    maxPosition: number;
};

export function CreateStatusModal({
                                      isOpen,
                                      onClose,
                                      onCreate,
                                      maxPosition,
                                  }: Props) {
    const [name, setName] = useState("");
    const [position, setPosition] = useState(maxPosition);
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoading = useAppSelector(selectIsLoading);

    useEffect(() => {
        if (isOpen) {
            setPosition(maxPosition);
            inputRef.current?.focus();
        }
    }, [isOpen, maxPosition]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;
        onCreate(name.trim(), position);
        setName("");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
             onClick={onClose}>
            <div className="bg-slate-900 w-96 text-white border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-xl">
                    <h2 className="h-20 flex items-center justify-center text-xl font-bold text-white text-neon-strong uppercase">
                        Add task status
                    </h2>
                    <PulsedStripe height="2px"></PulsedStripe>
                </div>
                <div className="p-4">
                    <input
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Status title"
                        className="w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl"
                    />
                    <label className="block text-sm text-gray-600 mb-1">
                        Status position (0 – {maxPosition})
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={maxPosition}
                        value={position}
                        onChange={(e) => setPosition(Number(e.target.value))}
                        className="w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl"
                    />
                    <div className="flex justify-end">
                        <MainButton
                            variant="primary"
                            disabled={isLoading || !name.trim()}
                            onClick={handleSubmit}
                            className="flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                "Create"
                            )}
                        </MainButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
