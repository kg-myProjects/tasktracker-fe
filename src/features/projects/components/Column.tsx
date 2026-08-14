import {type KeyboardEvent, useEffect, useState} from 'react';
import {clearStatusError, selectErrorMessage, updateTaskStatus,selectIsLoading as selectStatusLoading} from "../../statuses/slice/taskStatusSlice.ts";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import type {SortableColumnProps} from "./SortableColumn.tsx";
import NotificationModal from "../../../components/ui/NotificationModal.tsx";
import {ActionButton} from "../../../components/ui/buttons/ActionButton.tsx";
import {TrashIcon} from "../../../components/ui/icons/TrashIcon.tsx";

export function Column({ status,
                           allStatusNames,
                           children,
                           onAddTask,
                           onDelete,
                           canDelete,
}: SortableColumnProps) {

    const dispatch = useAppDispatch();
    const serverError = useAppSelector(selectErrorMessage);
    const isStatusLoading = useAppSelector(selectStatusLoading);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(status.name);
    const [validationError, setValidationError] = useState<{title: string, message: string} | null>(null);

    useEffect(() => {
        setNewName(status.name);
    }, [status.name]);

    const handleSave = () => {
        const trimmedName = newName.trim();

        if (!trimmedName) {
            setValidationError({
                title: "Empty Name",
                message: "The status name cannot be empty. Please enter at least one character."
            });
            setNewName(status.name);
            setIsEditing(false);
            return;
        }

        const isDuplicate = allStatusNames.some(
            (name) => name.toLowerCase() === trimmedName.toLowerCase() && name !== status.name
        );

        if (isDuplicate) {
            setValidationError({
                title: "Duplicate Status",
                message: `A column with the name "${trimmedName}" already exists on this board. Names must be unique.`
            });
            setNewName(status.name);
            setIsEditing(false);
            return;
        }

        if (trimmedName !== status.name) {
            dispatch(updateTaskStatus({ id: status.id, name: trimmedName }));
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setNewName(status.name);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col p-1 bg-surface-dark backdrop-blur-md rounded-xl border border-dark-accent/30 text-white w-[300px] min-h-[700px] transition-all hover:border-cyan-400/40">
            {/* TOP BAR */}
            <div className="flex text-lg m-1 font-semibold justify-between items-center">
                <div className="flex-1 flex gap-2">
                    {isEditing ? (
                        <input
                            autoFocus
                            className="w-full px-1 bg-secondary-dark border border-dark-accent/30 rounded-lg font-semibold text-lg outline-none"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <div
                            onClick={() => setIsEditing(true)}
                            className="flex-1 cursor-pointer px-[6px] py-[1px] min-h-[37px] hover:text-accent transition-colors truncate"
                            title="Click to edit status name"
                        >
                            {status.name}
                        </div>
                    )}
                    {validationError && (
                        <NotificationModal
                            title={validationError.title}
                            message={validationError.message}
                            buttonText="Back"
                            variant="error"
                            onClose={() => setValidationError(null)}
                        />
                    )}
                    {serverError && (
                        <NotificationModal
                            title="Access Denied"
                            message={serverError}
                            buttonText="Close"
                            onClose={() => dispatch(clearStatusError())}
                        />
                    )}
                </div>
                <div className="flex shrink-0">
                    {canDelete && onDelete && (
                        <button
                            onClick={onDelete}
                            disabled={isStatusLoading}
                            title="Delete status"
                            className={`p-2 rounded-lg transition-all flex items-center justify-center
                            ${isStatusLoading ? 'text-danger-red bg-danger-red/30' : 'text-text-muted hover:text-danger-red hover:bg-main-dark'}`}
                        >
                            {isStatusLoading ? (
                                /* SPINNER */
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <TrashIcon/>
                            )}
                        </button>
                    )}
                </div>
            </div>
            {/* CONTENT */}
            <div className="flex-grow touch-none">
                {children}
            </div>
            {/* BOTTOM BAR */}
            <div className="flex mt-2">
                <ActionButton className="flex-1" onClick={onAddTask}>Add Task</ActionButton>
            </div>
        </div>
    );
}