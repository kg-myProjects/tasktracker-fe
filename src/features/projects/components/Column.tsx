import type { TaskStatus } from "../../statuses/types";
import { useDroppable } from "@dnd-kit/core";

export function Column({ status,
                           children,
                           onAddTask,
                           onDelete,
                           canDelete,
}: { status: TaskStatus, children: React.ReactNode, onAddTask: () => void, onDelete?: () => void, canDelete?: boolean }) {
    const { setNodeRef } = useDroppable({ id: status.id });

    return (
        <div ref={setNodeRef} className="flex flex-col bg-transparent rounded-2xl border-2 border-cyan-400/20 text-cyan-400 p-4 min-w-[320px] min-h-[500px] transition-all hover:border-cyan-400/40">
            <h2 className="text-lg font-semibold mb-3 flex justify-between items-center text-cyan-400">
                {status.name}
                <div className="flex gap-2">
                <button onClick={onAddTask} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-xs font-black rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all uppercase">
                    + Add Task
                </button>
                    {canDelete && onDelete && (
                        <button
                            onClick={onDelete}
                            title="Delete column"
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                            <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    )}
                </div>
            </h2>
            <div className={"flex-grow"}>
            {children}
            </div>
        </div>
    );
}

