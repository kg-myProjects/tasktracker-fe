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
        <div ref={setNodeRef} className="flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border-2 border-cyan-400/20 text-cyan-400 p-4 min-w-[320px] min-h-[500px] transition-all hover:border-cyan-400/40">
            <h2 className="text-lg font-semibold mb-3 flex justify-between items-center text-cyan-400">
                {status.name}
                <div className="flex gap-2">
                <button onClick={onAddTask} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-xs font-black rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all uppercase">
                    + Add Task
                </button>
                {canDelete && onDelete && (
                    <button
                        onClick={onDelete}
                        className="bg-yellow-300 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                        Delete Column
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

