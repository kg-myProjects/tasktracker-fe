import { useState } from "react";
import type { Task, MarkerDto} from "../types";
import type {CollaboratorDto} from "../../projects/types";
import { NEON_COLORS } from "../constants/taskConstants.ts";

interface TaskSidebarProps {
    task: Task;
    projectMembers: CollaboratorDto[];
    projectMarkers: MarkerDto[];
    actions: {
        handleAddExecutor: (id: string) => void;
        handleAddMarker: (id: string) => void;
        handleCreateAndAddMarker: (name: string, color: string) => void;
        setIsCreatingChecklist: (val: boolean) => void;
    };
}

export const TaskSidebar = ({ task, projectMembers, projectMarkers, actions }: TaskSidebarProps) => {
    const [showMembers, setShowMembers] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [newMarkerName, setNewMarkerName] = useState("");
    const [selectedColor, setSelectedColor] = useState("bg-cyan-500");

    const actionButtons = [
        { id: 'members', label: 'Collaborators', icon: '👤', action: () => setShowMembers(!showMembers) },
        { id: 'labels', label: 'Markers', icon: '🏷', action: () => setShowLabels(!showLabels) },
        { id: 'checklist', label: 'Checklist', icon: '✅', action: () => actions.setIsCreatingChecklist(true) },
        { id: 'dates', label: 'Dates', icon: '📅' },
        { id: 'attachment', label: 'Attachments', icon: '📎' },
    ];

    return (
        <div className="w-full md:w-56 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Add on card</h3>
            <div className="flex flex-col gap-2 relative">
                {actionButtons.map((btn) => (
                    <div key={btn.id} className="relative">
                        <button
                            onClick={() => btn.action?.()}
                            className="w-full text-left px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-lg transition-all flex items-center gap-3 group"
                        >
                            <span className="text-base transition-transform group-hover:scale-120">{btn.icon}</span>
                            {btn.label}
                        </button>

                        {/* ВІКНО МАРКЕРИ */}
                        {btn.id === 'labels' && showLabels && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowLabels(false)} />
                                <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1">Project Markers</p>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {projectMarkers?.map((marker) => {
                                            const isSelected = task.markers?.some(m => m.id === marker.id);
                                            return (
                                                <button
                                                    key={marker.id}
                                                    onClick={() => actions.handleAddMarker(marker.id)}
                                                    className={`w-full h-9 mb-1.5 rounded-lg flex items-center px-3 text-[10px] font-black text-white uppercase transition-all shadow-sm ${marker.color} ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                                                >
                                                    {marker.name}
                                                    {isSelected && <span className="ml-auto text-xs">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                        <input
                                            value={newMarkerName}
                                            onChange={(e) => setNewMarkerName(e.target.value)}
                                            placeholder="New marker..."
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-[11px] outline-none focus:border-cyan-400 text-black"
                                        />
                                        <div className="flex flex-wrap gap-2 justify-between">
                                            {NEON_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`${color} w-6 h-6 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => { actions.handleCreateAndAddMarker(newMarkerName, selectedColor); setNewMarkerName(""); }}
                                            className="w-full bg-slate-900 text-white text-[10px] font-black py-2.5 rounded-xl uppercase hover:bg-black transition-all"
                                        >
                                            + Create & Assign
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ВІКНО УЧАСНИКИ */}
                        {btn.id === 'members' && showMembers && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowMembers(false)} />
                                <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1 italic text-center">Project Team</p>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {projectMembers?.map((member) => (
                                            <button
                                                key={member.id}
                                                onClick={() => actions.handleAddExecutor(member.id)}
                                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-cyan-50 border-2 border-transparent hover:border-cyan-100 transition-all text-left"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                                                    {member.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700 truncate flex-1">{member.email}</span>
                                                {task.executors?.some(ex => ex.id === member.id) && <span className="text-cyan-500 font-bold text-xs">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
