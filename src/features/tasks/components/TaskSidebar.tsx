import { useState } from "react";
import type {Task, MarkerDto, UpdateTaskDto} from "../types";
import type {CollaboratorDto} from "../../projects/types";
import { NEON_COLORS } from "../constants/taskConstants.ts";
import {setTaskError} from "../slice/tasksSlice";
import {useAppDispatch} from "../../../app/hooks.ts";

interface TaskSidebarProps {
    task: Task;
    projectMembers: CollaboratorDto[];
    projectMarkers: MarkerDto[];
    isUpdating: boolean;
    actions: {
        handleAddExecutor: (id: string) => void;
        handleAddMarker: (id: string) => void;
        handleCreateAndAddMarker: (name: string, color: string) => void;
        setIsCreatingChecklist: (val: boolean) => void;
        patchTask: (dto: Partial<UpdateTaskDto>) => void;
    };
}

export const TaskSidebar = ({ task, projectMembers, projectMarkers, actions, isUpdating }: TaskSidebarProps) => {
    const [showMembers, setShowMembers] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false); // Нове
    const [newMarkerName, setNewMarkerName] = useState("");
    const [selectedColor, setSelectedColor] = useState("bg-cyan-500");

    const actionButtons = [
        { id: 'members', label: 'Members', icon: '👤', action: () => setShowMembers(!showMembers) },
        { id: 'labels', label: 'Labels', icon: '🏷', action: () => setShowLabels(!showLabels) },
        { id: 'checklist', label: 'Checklist', icon: '✅', action: () => actions.setIsCreatingChecklist(true) },
        { id: 'dates', label: 'Dates', icon: '📅', action: () => setShowDatePicker(!showDatePicker) },
        { id: 'attachment', label: 'Attachment', icon: '📎' },
    ];


    const [tempDate, setTempDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : "");
    const [tempTime, setTempTime] = useState(task.dueDate ? task.dueDate.split('T')[1]?.substring(0, 5) : "12:00");

    const dispatch = useAppDispatch();

    const handleSaveDate = () => {
        if (!tempDate) return;

        const fullISOString = `${tempDate}T${tempTime}:00`;
        const selectedDate = new Date(fullISOString);
        const now = new Date();

        if (selectedDate < now) {
            dispatch(setTaskError("Deadline cannot be in the past! Please select a future date."));
            return;
        }

        actions.patchTask({ dueDate: fullISOString });
        setShowDatePicker(false);
    };

    return (
        <div className="md:col-span-4 space-y-4 shrink-0 h-auto relative overflow-visible">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-left">Add to card</h3>

            <div className="flex flex-col gap-3 relative z-30">
                {actionButtons.map((btn) => (
                    <div key={btn.id} className="relative flex flex-col">
                        <button
                            onClick={btn.action}
                            disabled={isUpdating}
                            className="w-full text-left px-4 py-3 bg-[#e8e9ec] hover:bg-[#dcdfe4] rounded-2xl text-[10px] font-black text-slate-600 flex items-center gap-3 transition-all group shadow-sm relative overflow-hidden"
                        >
                            {isUpdating ? (
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span className="text-lg group-hover:scale-110 transition-transform">{btn.icon}</span>
                            )}

                            <span className={isUpdating ? "opacity-50" : ""}>{btn.label}</span>

                            {/* Additional loading bar below the button for style */}
                            {isUpdating && (
                                <div className="animate-progress-fast shadow-[0_0_10px_#06b6d4]" />
                            )}
                        </button>

                        {/* Slide window */}

                        {/* MARKERS PICKER */}
                        {btn.id === 'labels' && showLabels && (
                            <div className="w-[280px] bg-white border-2 border-cyan-400 rounded-3xl shadow-2xl p-4 z-[100] mt-2 relative md:absolute md:top-0 md:right-full md:mr-4 animate-in slide-in-from-right-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Labels</span>
                                    <button onClick={() => setShowLabels(false)} className="text-slate-400">✕</button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                    {projectMarkers?.map((marker) => {
                                        const isSelected = task.markers?.some(m => m.id === marker.id);
                                        return (
                                            <button
                                                key={marker.id}
                                                onClick={() => actions.handleAddMarker(marker.id)}
                                                className={`w-full h-8 rounded-lg flex items-center px-3 text-[9px] font-black text-white uppercase transition-all ${marker.color} ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : 'opacity-90 hover:opacity-100'}`}
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
                                        placeholder="Create new label..."
                                        className="w-full bg-[#f1f2f4] border-2 border-transparent rounded-xl px-3 py-2 text-[10px] outline-none focus:bg-white focus:border-cyan-400 font-bold text-black"
                                    />
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {NEON_COLORS.slice(0, 10).map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`${color} w-5 h-5 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'hover:scale-105'}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => { actions.handleCreateAndAddMarker(newMarkerName, selectedColor); setNewMarkerName(""); }}
                                        className="w-full bg-cyan-500 text-white text-[9px] font-black py-2.5 rounded-xl uppercase shadow-md hover:bg-cyan-400 transition-all"
                                    >
                                        Create & Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MEMBERS PICKER */}
                        {btn.id === 'members' && showMembers && (
                            <div onClick={e => e.stopPropagation()} className="w-[280px] bg-white border-2 border-cyan-400 rounded-3xl shadow-2xl p-4 z-[100] mt-2 relative md:absolute md:top-0 md:right-full md:mr-4 animate-in slide-in-from-right-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Members</span>
                                    <button onClick={() => setShowMembers(false)} className="text-slate-400">✕</button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                    {projectMembers?.map((member) => (
                                        <button
                                            key={member.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                actions.handleAddExecutor(member.id);
                                            }}                                            className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-cyan-50 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                                {member.email.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-700 truncate flex-1">{member.email}</span>
                                            {task.executors?.some(ex => ex.id === member.id) && <span className="text-cyan-500 font-bold text-xs">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DATE PICKER */}
                        {btn.id === 'dates' && showDatePicker && (
                            <>
                            <div
                                className="fixed inset-0 z-[90]"
                                onClick={() => setShowDatePicker(false)}
                            />
                            <div
                                onClick={e => e.stopPropagation()}
                                className="w-[300px] bg-white border-2 border-cyan-500 rounded-3xl shadow-2xl p-5 z-[100] mt-2 relative md:absolute md:top-0 md:right-full md:mr-4 animate-in zoom-in-95"
                            >
                                <p className="text-[10px] font-black text-cyan-600 uppercase mb-4 text-center tracking-widest px-1">Set Deadline</p>

                                <div className="bg-[#f1f2f4] rounded-xl p-4 mb-5 shadow-inner">
                                    <label className="text-[9px] font-black text-slate-400 uppercase px-1 block mb-2 text-left tracking-widest">
                                        Select Month & Day
                                    </label>
                                    <input
                                        type="date"
                                        value={tempDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setTempDate(e.target.value)}
                                        className="w-full bg-white border-2 border-transparent rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-cyan-400 transition-all shadow-sm"
                                    />
                                </div>

                                   <div className="mb-5 space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Time</label>
                                    <input
                                        type="time"
                                        value={tempTime}
                                        onChange={(e) => setTempTime(e.target.value)}
                                        className="w-full bg-[#f1f2f4] border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 ring-cyan-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            handleSaveDate();
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full bg-cyan-500 text-white text-[10px] font-black py-3 rounded-xl uppercase shadow-lg shadow-cyan-500/30 active:scale-95 transition-all"
                                    >
                                        Save Deadline
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTempDate("");
                                            actions.patchTask({ dueDate: "" });
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full text-rose-500 text-[9px] font-black py-2 uppercase hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        Remove
                                    </button>
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
