import { useState } from "react";
import { useAppSelector } from "../../../app/hooks.ts";
import { useTaskActions } from "../hooks/useTaskActions.ts";
import { TaskChecklist } from "./TaskChecklist.tsx";
import { TaskSidebar } from "./TaskSidebar.tsx";
import type { Task } from "../types";

interface TaskEditModalProps {
    card: Task;
    onClose: () => void;
}

export function EditTaskModal({ card, onClose }: TaskEditModalProps) {
    const [title, setTitle] = useState(card.title || "");
    const [description, setDescription] = useState(card.description || "");
    const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);

    const project = useAppSelector((state) => state.projects.currentProject);
    const allTasks = useAppSelector(state => state.tasks.tasks);
    const currentTask = allTasks.find(t => t.id === card.id) || card;

    const {
        handleAddExecutor,
        handleAddMarker,
        handleCreateAndAddMarker,
        syncChecklist,
        patchTask
    } = useTaskActions(currentTask, project?.id);

    const handleSave = () => {
        patchTask({ title, description });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/95 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl border-2 border-cyan-500/30 shadow-2xl w-full max-w-2xl my-8 transform transition-all" onClick={e => e.stopPropagation()}>

                {/* Шапка */}
                <div className="bg-cyan-500 px-6 py-4 flex items-center justify-between border-b-2 border-[#0f172a] rounded-t-2xl">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-2 h-6 bg-[#0f172a] rounded-full"></div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-transparent text-lg font-black text-white uppercase outline-none focus:border-b w-full"
                        />
                    </div>
                    <button onClick={onClose} className="text-white hover:rotate-90 transition-transform text-2xl ml-4">✕</button>
                </div>

                <div className="p-8 flex flex-col md:flex-row gap-8 bg-slate-50 rounded-b-2xl">
                    {/* Base Content */}
                    <div className="flex-1 space-y-6">

                        {/* Markers and Executors */}
                        <div className="flex flex-wrap gap-4">
                            {currentTask.markers?.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Markers</p>
                                    <div className="flex gap-1">
                                        {currentTask.markers.map(m => (
                                            <span key={m.id} className={`${m.color} h-2 w-8 rounded-full shadow-sm`} title={m.name} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentTask.executors && currentTask.executors.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Members</p>
                                    <div className="flex -space-x-2">
                                        {currentTask.executors.map((ex) => (
                                            <div
                                                key={ex.id}
                                                title={ex.email}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black uppercase shadow-sm hover:scale-110 transition-transform cursor-help"
                                            >
                                                {ex.email ? ex.email.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">📝 Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 min-h-[120px] text-slate-800 focus:border-cyan-400 outline-none transition-all shadow-inner"
                                placeholder="What needs to be done?"
                            />
                        </div>

                        {/* CheckList */}
                        <TaskChecklist
                            items={currentTask.checklist || []}
                            onSync={syncChecklist}
                            isCreating={isCreatingChecklist}
                            onCloseCreating={() => setIsCreatingChecklist(false)}
                        />

                        {/* Кнопки */}
                        <div className="flex gap-3 pt-6 border-t border-slate-200">
                            <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black px-10 py-3 rounded-xl border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all uppercase">Save Changes</button>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-[10px] font-black px-6 py-3 uppercase transition-colors">Cancel</button>
                        </div>
                    </div>

                    {/* Бокова панель */}
                    <TaskSidebar
                        task={currentTask}
                        projectMembers={project?.projectTeam || []}
                        projectMarkers={project?.markers || []}
                        actions={{
                            handleAddExecutor,
                            handleAddMarker,
                            handleCreateAndAddMarker,
                            setIsCreatingChecklist
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
