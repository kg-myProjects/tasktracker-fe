import type {Task} from "../../tasks/types";
import {API_URL} from "../../../config/api.ts";
import {sortCollaboratorsByRole} from "../utils/projectUtils.ts";
import {CrownIcon} from "../../../components/ui/icons/CrownIcon.tsx";

export function TaskOverlayCard({task}: { task: Task }) {
    return (
        <div className="relative bg-white rounded-lg p-2 border-2 border-cyan-500 shadow-2xl rotate-3 w-[300px] cursor-grabbing select-none touch-none">
            {/* TASK MARKERS */}
            {task.markers && task.markers.length > 0 && (
                <div className="flex gap-2 mb-2">
                    {task.markers.map(marker => (
                        <div
                            key={marker.id}
                            className={`p-[2px] rounded-full ${marker.color} text-[8px] text-white shadow-sm`}
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
                    <div className="flex items-center gap-1 text-[10px] md:text-[12px] font-black text-slate-700 uppercase tracking-tighter">
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
    );
}