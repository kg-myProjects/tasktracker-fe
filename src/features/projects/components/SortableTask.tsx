import type { Task } from "../../tasks/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppDispatch } from "../../../app/hooks";
import { deleteTask } from "../../tasks/slice/tasksSlice";
import React, {useState} from "react";

import ConfirmModal from "../../../components/ui/ConfirmModal.tsx"; // Убедись, что экшен создан

export const SortableTask = React.memo( function SortableTask({
                                 task,
                                 onOpenEdit
                             }: {
    task: Task;
    onOpenEdit: () => void
}) {
    const dispatch = useAppDispatch();
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

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
            className="group relative bg-white rounded-xl p-3 border-2 border-cyan-500 transition-shadow duration-200 cursor-grab active:cursor-grabbing animate-in zoom-in-95 shadow-sm hover:shadow-md"
        >
            {/* Область захвата для dnd-kit */}
            <div {...attributes} {...listeners}>

                {task.markers && task.markers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {task.markers.map(marker => (
                            <div
                                key={marker.id}
                                className={`h-1.5 w-6 rounded-full ${marker.color} shadow-sm transition-all group-hover:w-8`}
                                title={marker.name}
                            />
                        ))}
                    </div>
                )}

                <div className="font-semibold text-black pr-6">{task.title}</div>

                {task.description && (
                    <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {task.description}
                     </div>
                )}

                <div className="mt-3 flex items-center justify-between">

                    {/* Progress checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            <span className={task.checklist.every(i => i.completed) ? "text-emerald-500" : ""}>
                                ✅ {task.checklist.filter(i => i.completed).length}/{task.checklist.length}
                            </span>
                        </div>
                    )}

                    {/* Avatars */}
                    {task.executors && task.executors.length > 0 && (
                        <div className="flex -space-x-1.5 ml-auto">
                            {task.executors.map(ex => (
                                <div
                                    key={ex.id}
                                    className="w-5 h-5 rounded-full bg-cyan-500 border border-white flex items-center justify-center text-[8px] font-bold text-white uppercase"
                                    title={ex.email}
                                >
                                    {ex.email.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Кнопка удаления в стиле Trello (появляется при hover) */}
            <button
                onClick={handleDelete}
                title="Delete task"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
            >
                <svg
                    xmlns="http://www.w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>

            {showConfirm && (
                <div onClick={(e) => e.stopPropagation()}>
                <ConfirmModal
                    title="Delete task?"
                    message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
                </div>
            )}

        </div>
    );
});
