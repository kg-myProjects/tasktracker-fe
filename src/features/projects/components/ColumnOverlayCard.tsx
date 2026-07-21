import type {TaskStatus} from "../../statuses/types";
import type {Task} from "../../tasks/types";

export function ColumnOverlayCard({status, tasks}: { status: TaskStatus; tasks: Task[] }) {
    return (
        <div className="flex flex-col p-1 bg-slate-900/95 backdrop-blur-md rounded-xl border-2 border-cyan-500 shadow-2xl text-cyan-400 w-[320px] min-h-[300px] max-h-[500px] cursor-grabbing select-none touch-none overflow-hidden">
            {/* TOP BAR */}
            <div className="flex text-lg m-1 font-semibold justify-between items-center">
                <div className="flex-1 px-[6px] py-[1px] truncate">
                    {status.name}
                </div>
            </div>
            {/* TASKS PREVIEW */}
            <div className="flex flex-col gap-2 px-1 pb-1 overflow-hidden">
                {tasks.slice(0, 4).map(task => (
                    <div
                        key={task.id}
                        className="bg-white rounded-lg p-2 border-2 border-white shadow-sm"
                    >
                        <span className="text-[10px] font-black text-cyan-800 uppercase tracking-widest leading-none">
                            Task #{task.taskNumber}
                        </span>
                        <div className="text-slate-700 leading-tight truncate">
                            {task.title}
                        </div>
                    </div>
                ))}
                {tasks.length > 4 && (
                    <div className="text-center text-xs text-cyan-400/60 py-1">
                        +{tasks.length - 4} more
                    </div>
                )}
            </div>
        </div>
    );
}