import { useEffect, useRef, useState } from "react";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 text-black">
                <h2 className="text-lg font-semibold mb-4">
                    Новый статус
                </h2>

                <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название колонки"
                    className="w-full border rounded px-3 py-2 mb-3"
                />

                <label className="block text-sm text-gray-600 mb-1">
                    Position (0 – {maxPosition})
                </label>

                <input
                    type="number"
                    min={0}
                    max={maxPosition}
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 border rounded"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-3 py-1.5 bg-green-600 text-white rounded"
                    >
                        Создать
                    </button>
                </div>
            </div>
        </div>
    );
}
