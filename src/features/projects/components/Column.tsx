import type { TaskStatus } from "../../statuses/types";
import { useDroppable } from "@dnd-kit/core";

export function Column({ status, children, onAddTask }: { status: TaskStatus, children: React.ReactNode, onAddTask: () => void }) {
    const { setNodeRef } = useDroppable({ id: status.id });

    return (
        <div ref={setNodeRef} className="flex flex-col bg-slate-200 rounded-lg min-w-[320px] p-4 min-h-[500px]">
            <h2 className="text-lg font-semibold mb-3 flex justify-between items-center text-black">
                {status.name}
                <button onClick={onAddTask} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    + Add Task
                </button>
            </h2>
            <div className={"flex-grow"}>
            {children}
            </div>
        </div>
    );
}

