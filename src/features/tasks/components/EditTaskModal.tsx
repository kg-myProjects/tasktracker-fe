import { useState } from "react";
import {useAppSelector} from "../../../app/hooks.ts";
import { useTaskActions } from "../hooks/useTaskActions.ts";
import { TaskChecklist } from "./TaskChecklist.tsx";
import { TaskSidebar } from "./TaskSidebar.tsx";
import type { Task } from "../types";
import {TaskAttachments} from "./TaskAttachments.tsx";

interface TaskEditModalProps {
    card: Task;
    onClose: () => void;
}


export function EditTaskModal({ card, onClose }: TaskEditModalProps) {
    const project = useAppSelector((state) => state.projects.currentProject);
    const allTasks = useAppSelector(state => state.tasks.tasks);
    const currentTask = allTasks.find(t => t.id === card.id) || card;
    const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);

    const {
        handleAddExecutor,
        handleAddMarker,
        handleCreateAndAddMarker,
        syncChecklist,
        patchTask,
        isUpdating
    } = useTaskActions(currentTask, project?.id);

    return (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
            {/* Main container */}
            <div className="bg-[#f1f2f4] rounded-[40px] shadow-2xl w-full max-w-5xl my-8 relative flex flex-col overflow-visible"
                 onClick={e => e.stopPropagation()}>

                {/* 1. Cover */}
                <div className="h-40 w-full shrink-0 relative transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-inner rounded-t-[40px]">
                    <button onClick={onClose}
                            className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all">
                        ✕
                    </button>

                    {/* Avatar */}
                    <div className="absolute -bottom-8 left-10">
                        <div className="w-20 h-20 rounded-full border-[6px] border-[#f1f2f4] shadow-xl overflow-visible bg-white flex items-center justify-center text-slate-300 text-3xl">
                            👤
                        </div>
                    </div>
                </div>

                <div className="px-10 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

                    {/* Left part */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-1">
                            <input
                                defaultValue={currentTask.title}
                                onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && val !== currentTask.title) patchTask({ title: val });
                                }}
                                className="w-full bg-transparent text-3xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500/20 rounded-lg px-2 -ml-2 transition-all"
                            />
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest px-1">
                                in list <span className="underline decoration-cyan-500/50 cursor-pointer">Development</span>
                            </p>
                        </div>

                        {/* Markers and Members */}
                        <div className="flex flex-wrap gap-10">
                            {currentTask.markers?.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Labels</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {currentTask.markers.map(m => (
                                            <span key={m.id} className={`${m.color} px-3 py-1 rounded-md text-[10px] font-black text-white shadow-sm uppercase`}>
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentTask.executors?.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</h4>
                                    <div className="flex -space-x-2">
                                        {currentTask.executors.map(ex => (
                                            <div key={ex.id} className="w-9 h-9 rounded-full bg-slate-800 border-2 border-[#f1f2f4] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                {ex.email.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Due Date Display */}
                            {currentTask.dueDate && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Due Date</p>
                                    <div className="bg-white border-2 border-cyan-500/10 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 group hover:border-cyan-500/30 transition-all cursor-pointer">
                                        <span className="text-base">📅</span>
                                        <span className="text-slate-700 text-[10px] font-black uppercase">
                {new Date(currentTask.dueDate).toLocaleString('uk-UA', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
            </span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <span className="text-lg">📝</span> Description
                            </h4>
                            <textarea
                                defaultValue={currentTask.description}
                                onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val !== currentTask.description) patchTask({ description: val });
                                }}
                                className="w-full min-h-[120px] p-4 bg-slate-200/50 hover:bg-slate-200/80 focus:bg-white rounded-2xl outline-none text-slate-700 text-sm leading-relaxed transition-all resize-none border-2 border-transparent focus:border-cyan-500/20"
                                placeholder="Add a more detailed description..."
                            />
                        </div>

                        {/* TaskAttachments */}
                        <TaskAttachments
                            taskId={currentTask.id}
                            attachments={currentTask.attachments || []}
                        />


                        {/* CheckList */}
                        <TaskChecklist
                            items={currentTask.checklist || []}
                            onSync={syncChecklist}
                            isCreating={isCreatingChecklist}
                            onCloseCreating={() => setIsCreatingChecklist(false)}
                        />
                    </div>

                    {/* SideBar */}
                    <div className="space-y-6">
                        <TaskSidebar
                            task={currentTask}
                            isUpdating={isUpdating}
                            projectMembers={project?.projectTeam || []}
                            projectMarkers={project?.markers || []}
                            actions={{
                                handleAddExecutor, handleAddMarker,
                                handleCreateAndAddMarker, setIsCreatingChecklist,
                                patchTask
                            }}
                        />

                        {/* Status-footer SideBar */}
                        <div className="p-4 bg-white/50 rounded-2xl border border-white">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-center">System Info</p>
                            <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                <span>Status:</span>
                                <span className="text-cyan-600">Active Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
