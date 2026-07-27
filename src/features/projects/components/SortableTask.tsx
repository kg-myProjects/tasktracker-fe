import type {Task} from "../../tasks/types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {deleteTask, selectIsLoading} from "../../tasks/slice/tasksSlice";
import React, {useState} from "react";
import ConfirmModal from "../../../components/ui/ConfirmModal.tsx";
import {API_URL} from "../../../config/api.ts";
import {sortCollaboratorsByRole} from "../utils/projectUtils.ts";
import {CrownIcon} from "../../../components/ui/icons/CrownIcon.tsx";
import {TrashIcon} from "../../../components/ui/icons/TrashIcon.tsx";

export const SortableTask = React.memo(function SortableTask({task, onOpenEdit}: {
    task: Task;
    onOpenEdit: () => void
}) {

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectIsLoading);

    const [showConfirm, setShowConfirm] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        willChange: transform ? "transform" : "auto",
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteTask(task.id));
        setShowConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onOpenEdit}
            className="relative bg-white rounded-lg p-2 transition-shadow duration-200 border-2 border-white cursor-grab active:cursor-grabbing animate-in zoom-in-95 shadow-sm hover:border-cyan-400 hover:shadow-md"
        >
            {/* DRAG AREA */}
            <div {...attributes} {...listeners} className="select-none touch-none">
                {/* TASK MARKERS */}
                {task.markers && task.markers.length > 0 && (
                    <div className="flex gap-2 mb-2">
                        {task.markers.map(marker => (
                            <div
                                key={marker.id}
                                className={`p-[2px] rounded-full ${marker.color} text-[8px] text-white shadow-sm transition-all`}
                                title={marker.name}
                            >{marker.name}</div>
                        ))}
                    </div>
                )}
                {/* TASK NUMBER */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] md:text-[12px] font-black text-cyan-800 uppercase tracking-widest leading-none">
                        Task #{task.taskNumber}
                    </span>
                    <div className="text-slate-700 leading-tight pr-6 truncate">
                        {task.title}
                    </div>
                </div>
                {/* TASK DESCRIPTION */}
                {task.description && (
                    <div className="text-[10px] md:text-[12px] text-slate-500 my-2 line-clamp-2">
                        {task.description}
                    </div>
                )}
                {/* TASK CARD BOTTOM BAR */}
                <div className="flex mt-1 items-center justify-between">
                    {/* CHECKLIST */}
                    {task.checklist && task.checklist.length > 0 && (
                        <div
                            className="flex items-center gap-1 text-[10px] md:text-[12px] font-black text-slate-700 uppercase tracking-tighter">
                            <span className={task.checklist.every(i => i.completed) ? "text-green-500" : ""}>
                                ✅ {task.checklist.filter(i => i.completed).length}/{task.checklist.length}
                            </span>
                        </div>
                    )}
                    {/* AVATARS */}
                    {task.executors && task.executors.length > 0 && (
                        <div className="flex -space-x-3 ml-auto">
                            {sortCollaboratorsByRole(task.executors).map(executor => (
                                <div key={executor.id} className="relative">
                                    {executor.roles.includes("OWNER") && (
                                        <CrownIcon className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" />
                                    )}
                                    <div
                                        className="flex w-8 h-8 rounded-full bg-cyan-300 border-2 border-cyan-500 items-center justify-center text-[12px] font-bold text-white overflow-hidden uppercase"
                                        title={executor.email}
                                    >
                                        {executor.avatarUrl ? (
                                            <img
                                                src={`${API_URL}${executor.avatarUrl}${executor.avatarUpdatedAt ? `?t=${executor.avatarUpdatedAt}` : ""}`}
                                                alt={executor.email}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            executor.email.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* DELETE BUTTON */}
            <button
                onClick={handleDelete}
                disabled={isLoading}
                title="Delete this task"
                className={`absolute top-2 right-2 p-1.5 rounded-md transition-all 
                ${isLoading ? "opacity-100 bg-slate-100" : "text-slate-400 hover:text-red-500 hover:bg-red-100"}`}
            >
                {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                ) : (
                    <TrashIcon />
                )}
            </button>

            {showConfirm && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmModal
                        title="Delete task?"
                        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                        confirmText={isLoading ? "Deleting..." : "Delete"}
                        isLoading={isLoading}
                        cancelText="Cancel"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                </div>
            )}
        </div>
    );
});