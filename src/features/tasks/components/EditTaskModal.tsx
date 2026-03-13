import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useTaskActions} from "../hooks/useTaskActions.ts";
import {TaskChecklist} from "./TaskChecklist.tsx";
import {TaskSidebar} from "./TaskSidebar.tsx";
import type {Task} from "../types";
import {TaskAttachments} from "./TaskAttachments.tsx";
import {TaskComments} from "./TaskComments.tsx";
import {getComments} from "../slice/tasksSlice";
import {format, formatDistanceToNow} from 'date-fns';

interface TaskEditModalProps {
    card: Task;
    onClose: () => void;
}


export function EditTaskModal({card, onClose}: TaskEditModalProps) {
    const project = useAppSelector((state) => state.projects.currentProject);
    const allTasks = useAppSelector(state => state.tasks.tasks);
    const currentTask = allTasks.find(t => t.id === card.id) || card;
    const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
    const allStatuses = useAppSelector((state) => state.taskStatuses.taskStatuses);
    const currentStatus = allStatuses.find(s => s.id === currentTask.statusId);
    const statusName = currentStatus ? currentStatus.name : "Unknown Status";

    const {
        handleAddExecutor,
        handleAddMarker,
        handleCreateAndAddMarker,
        syncChecklist,
        patchTask,
        isUpdating
    } = useTaskActions(currentTask, project?.id);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentTask.id) {
            dispatch(getComments(currentTask.id));
        }
    }, [currentTask.id, dispatch]);

    return (
        <div
            className="fixed inset-0 bg-[url(/background.png)] bg-cover bg-center z-50 flex items-center justify-center p-0 overflow-hidden animate-in fade-in duration-500"
            onClick={onClose}>
            {/* Main container */}
            <div
                className="w-screen h-screen bg-black/20 border-0 flex flex-col relative overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}>

                {/* 1. Cover */}
                {/* 1. Cover */}
                <div className="h-44 w-full shrink-0 relative bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 overflow-hidden border-b border-cyan-500/20">
                    <div className="animate-progress-fast opacity-50"></div>

                    <button onClick={onClose}
                            className="absolute top-6 right-6 bg-cyan-500/10 hover:bg-rose-500/20 text-cyan-400 hover:text-rose-400 w-10 h-10 rounded-xl border border-cyan-500/30 flex items-center justify-center font-bold z-10 transition-all">
                        ✕
                    </button>

                    {/* Header */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                        <div className="space-y-3 w-full max-w-3xl px-4 flex flex-col items-center">

                            {/* TaskNumber */}
                            <span className="text-[10px] font-black text-cyan-500/40 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10 tracking-[0.3em] uppercase">
                Task Registry // ID: #{currentTask.taskNumber}
            </span>

                            <input
                                defaultValue={currentTask.title}
                                onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && val !== currentTask.title) patchTask({title: val});
                                }}
                                className="w-full bg-transparent text-4xl font-black text-white text-neon-strong outline-none transition-all uppercase tracking-tighter text-center"
                            />

                            <div className="flex items-center gap-3 justify-center text-cyan-500/40 ">
                                STATUS
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                                <span className="text-cyan-400 text-sm font-black uppercase tracking-[0.2em]">
                    {statusName}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-10 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

                    {/* Left part */}
                    <div className="space-y-8">

                        {/* Markers and Members */}
                        <div className="flex flex-wrap gap-10">
                            {currentTask.markers?.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3"> Labels</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {currentTask.markers.map(m => (
                                            <span key={m.id}
                                                  className={`${m.color} px-3 py-1.5 rounded-lg text-[9px] font-black text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] uppercase tracking-wider`}>
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentTask.executors?.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3">Members</h4>
                                    <div className="flex -space-x-2">
                                        {currentTask.executors.map(ex => (
                                            <div key={ex.id}
                                                 className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-black shadow-lg">
                                                {ex.email.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Due Date Display */}
                            {currentTask.dueDate && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3">Deadline</h4>
                                    <div
                                        className="bg-cyan-500/5 border border-cyan-500/20 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 group hover:border-cyan-500/50 transition-all cursor-pointer">
                                        <span className="text-cyan-400 animate-twinkle">📅</span>
                                        <span
                                            className="text-cyan-100 text-[10px] font-black uppercase tracking-tighter">
                {new Date(currentTask.dueDate).toLocaleString('en-US', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
            </span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="animate-flicker">›</span> Description
                            </h4>
                            <textarea
                                defaultValue={currentTask.description}
                                onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val !== currentTask.description) patchTask({description: val});
                                }}
                                className="w-full min-h-[120px] p-4 bg-slate-900/50 hover:bg-slate-900/80 focus:bg-black/40 rounded-2xl outline-none placeholder:text-white text-white text-sm leading-relaxed transition-all resize-none border border-cyan-500/20 focus:border-cyan-400 shadow-inner"
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
                        <div className="pt-4">
                            <TaskComments taskId={currentTask.id}/>
                        </div>
                    </div>

                    {/* SideBar */}
                    <div className="space-y-6">
                        <div className="bg-black/20 p-4 rounded-[2rem] border border-white/5 space-y-6">
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
                        </div>

                        {/* Activity Footer — Unified Style */}
                        <div className="mt-4 p-5 bg-white/5 rounded-2xl border border-white/5 group transition-all hover:border-cyan-500/20 shadow-inner">
                            <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em] mb-4 px-1 border-b border-white/5 pb-2">
                                HISTORY
                            </p>

                            <div className="flex flex-col gap-3 px-1">
                                {/* 1. Initialized (Верхній рядок) */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500/20"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                    Initialized
                </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-cyan-400/80">
                {currentTask.createdAt
                    ? format(new Date(currentTask.createdAt), 'MMM d, yyyy')
                    : '---'}
            </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                    Last Update
                </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-cyan-400">
                {currentTask.updatedAt
                    ? formatDistanceToNow(new Date(currentTask.updatedAt), {addSuffix: true})
                    : 'Just now'}
            </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
