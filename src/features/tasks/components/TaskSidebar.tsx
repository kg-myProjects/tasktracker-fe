import {useEffect, useRef, useState} from "react";
import type {Task, MarkerDto, UpdateTaskDto} from "../types";
import type {CollaboratorDto} from "../../projects/types";
import {NEON_COLORS} from "../constants/taskConstants.ts";
import {setTaskError} from "../slice/tasksSlice";
import {useAppDispatch} from "../../../app/hooks.ts";
import {AttachmentPicker} from "./AttachmentPicker.tsx";
import ConfirmModal from "../../../components/ui/ConfirmModal.tsx";
import {API_URL} from "../../../config/api.ts";
import {sortCollaboratorsByRole} from "../../projects/utils/projectUtils.ts";
import {CrownIcon} from "../../../components/ui/icons/CrownIcon.tsx";
import {TrashIcon} from "../../../components/ui/icons/TrashIcon.tsx";
import MainButton from "../../../components/ui/buttons/MainButton.tsx";

interface TaskSidebarProps {
    task: Task;
    projectMembers: CollaboratorDto[];
    projectMarkers: MarkerDto[];
    isUpdating: boolean;
    actions: {
        handleAddExecutor: (id: string) => void;
        handleAddMarker: (id: string) => void;
        handleCreateAndAddMarker: (name: string, color: string) => void;
        handleDeleteGlobalMarker: (id: string) => Promise<void>;
        setIsCreatingChecklist: (val: boolean) => void;
        patchTask: (dto: Partial<UpdateTaskDto>) => void;
    };
}

type ActivePopup = "members" | "labels" | "dates" | "attachment" | null;

export const TaskSidebar = ({task, projectMembers, projectMarkers, actions, isUpdating}: TaskSidebarProps) => {

    const dispatch = useAppDispatch();

    const [activePopup, setActivePopup] = useState<ActivePopup>(null);
    const [newMarkerName, setNewMarkerName] = useState("");
    const [selectedColor, setSelectedColor] = useState("bg-cyan-500");
    const [markerToDelete, setMarkerToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [tempDate, setTempDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : "");
    const [tempTime, setTempTime] = useState(task.dueDate ? task.dueDate.split('T')[1]?.substring(0, 5) : "12:00");

    const sidebarRef = useRef<HTMLDivElement>(null);

    const togglePopup = (popup: Exclude<ActivePopup, null>) => {
        setActivePopup(prev => (prev === popup ? null : popup));
    };

    const actionButtons = [
        {
            id: "members",
            label: "Members",
            icon: "👤",
            action: () => togglePopup("members"),
        },
        {
            id: "labels",
            label: "Labels",
            icon: "🏷",
            action: () => togglePopup("labels"),
        },
        {
            id: 'checklist',
            label: 'Checklist',
            icon: '✅',
            action: () => actions.setIsCreatingChecklist(true) },
        {
            id: "dates",
            label: "Dates",
            icon: "📅",
            action: () => togglePopup("dates"),
        },
        {
            id: "attachment",
            label: "Attachment",
            icon: "📎",
            action: () => togglePopup("attachment"),
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (markerToDelete) {
                return;
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [markerToDelete]);

    const handleSaveDate = () => {
        if (!tempDate) return;

        const fullISOString = `${tempDate}T${tempTime}:00`;
        const selectedDate = new Date(fullISOString);
        const now = new Date();

        if (selectedDate < now) {
            dispatch(setTaskError("Deadline cannot be in the past! Please select a future date!"));
            return;
        }
        const backendFormat = selectedDate.toISOString();

        actions.patchTask({ dueDate: backendFormat });
        setActivePopup(null);
    };

    return (
        <div
            ref={sidebarRef}
            className="md:col-span-4 space-y-4 shrink-0 h-auto relative overflow-visible">
            <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">Add to task</h4>
            <div className="flex flex-col gap-3 relative z-30">
                {actionButtons.map((btn) => (
                    <div key={btn.id} className="relative flex flex-col">
                        <button
                            onClick={btn.action}
                            disabled={isUpdating}
                            className="w-full text-left px-4 py-3 bg-cyan-500 text-white hover:bg-cyan-700 rounded-2xl text-[15px] font-black  flex items-center gap-3 transition-all group shadow-sm relative overflow-hidden"
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
                        {/* MARKERS PICKER */}
                        {btn.id === 'labels' && activePopup === "labels" && (
                            <div className="w-[350px] bg-white border-2 border-cyan-400 rounded-3xl shadow-2xl p-4 z-[100] mt-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in slide-in-from-right-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Labels</span>
                                </div>
                                <div className="max-h-48 space-y-1.5 pr-1 custom-scrollbar">
                                    {projectMarkers?.map((marker) => {
                                        const isSelected = task.markers?.some(m => m.id === marker.id);
                                        return (
                                            <div key={marker.id} className="flex items-center">
                                                <button
                                                    onClick={() => actions.handleAddMarker(marker.id)}
                                                    className={`
                                                    flex-1 h-8 rounded-md flex items-center px-1
                                                    text-[9px] font-black text-white uppercase
                                                    transition-all ${marker.color}
                                                        ${isSelected
                                                            ? "shadow-md scale-[1.05]"
                                                            : "opacity-90 hover:opacity-100"
                                                        }
                                                    `}
                                                >
                                                    {/* CHECKBOX */}
                                                    <span
                                                        className={`
                                                            w-3.5 h-3.5 mr-2 rounded-sm border 
                                                            flex items-center justify-center
                                                            ${isSelected
                                                            ? "bg-white/90 border-white"
                                                            : "border-white/70 bg-transparent"
                                                            }
                                                        `}
                                                    >
                                                    {isSelected && (
                                                        <span className="text-cyan-600 text-[10px] font-black">
                                                            ✓
                                                        </span>
                                                    )}
                                                    </span>
                                                    {/* NAME */}
                                                    <span className="truncate">
                                                        {marker.name}
                                                    </span>
                                                    {/* DELETE MARKER */}
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMarkerToDelete(marker.id);
                                                        }}
                                                        title="Delete this marker"
                                                        className="ml-auto p-1 rounded-md text-white/70 hover:text-white hover:bg-black/20 transition-all"
                                                    >
                                                    <TrashIcon className="w-3.5 h-3.5"/>
                                                </span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 flex flex-col items-center justify-center border-t border-slate-100 space-y-3">
                                    <input
                                        value={newMarkerName}
                                        onChange={(e) => setNewMarkerName(e.target.value)}
                                        placeholder="Create new label..."
                                        className="w-full bg-[#f1f2f4] border-2 border-transparent rounded-xl px-3 py-2 text-[10px] outline-none focus:bg-white focus:border-cyan-400 font-bold text-black"
                                    />
                                    <div className="flex flex-wrap gap-2 mb-5 justify-center">
                                        {NEON_COLORS.slice(0, 10).map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`${color} w-5 h-5 rounded-full transition-all ${selectedColor === color ? 'scale-115' : 'hover:scale-115'}`}
                                            />
                                        ))}
                                    </div>
                                    <MainButton size="compact"
                                        onClick={() => { actions.handleCreateAndAddMarker(newMarkerName, selectedColor); setNewMarkerName(""); }}
                                    >
                                        Create & Add
                                    </MainButton>
                                </div>
                            </div>
                        )}
                        {/* MEMBERS PICKER */}
                        {btn.id === 'members' && activePopup === "members" && (
                            <div onClick={e => e.stopPropagation()} className="w-[350px] bg-white border-2 border-cyan-400 rounded-3xl shadow-2xl p-4 z-[100] mt-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in slide-in-from-right-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Members</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                    {sortCollaboratorsByRole(projectMembers)?.map((member) => (
                                        <button
                                            key={member.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                actions.handleAddExecutor(member.id);
                                            }}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-800 group transition-all text-left"
                                        >
                                            <div className="relative shrink-0">
                                                {member.roles.includes("OWNER") && (
                                                    <CrownIcon className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" />
                                                )}
                                                <div className="flex
                                                items-center
                                                justify-center
                                                w-9 h-9 rounded-full
                                                bg-cyan-300
                                                border-2 border-cyan-500
                                                text-[12px] font-black text-white shadow-sm
                                                transition-colors
                                                overflow-hidden">
                                                    {member.avatarUrl ? (
                                                        <img
                                                            src={`${API_URL}${member.avatarUrl}${member.avatarUpdatedAt ? `?t=${member.avatarUpdatedAt}` : ""}`}
                                                            alt={member.email}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        member.email.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-700 group-hover:text-white truncate flex-1">{member.email}</span>
                                            {task.executors?.some(ex => ex.id === member.id) && <span className="text-cyan-500 font-bold text-xs">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* DATE PICKER */}
                        {btn.id === 'dates' && activePopup === "dates" && (
                            <div
                                onClick={e => e.stopPropagation()}
                                className="w-[350px] bg-white border-2 border-cyan-500 rounded-3xl shadow-2xl p-5 z-[100] mt-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95"
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
                                <div className="flex justify-end gap-2">
                                    <MainButton size="compact" onClick={() => {handleSaveDate(); setActivePopup(null);}}>
                                        Save
                                    </MainButton>
                                    <MainButton size="compact" variant="danger" onClick={() => {
                                        setTempDate("");
                                        actions.patchTask({ dueDate: "" });
                                        setActivePopup(null);
                                        }
                                    }
                                    >
                                        Remove
                                    </MainButton>
                                </div>
                            </div>
                        )}
                        {/* ATTACHMENT PICKER */}
                        {btn.id === 'attachment' && activePopup === "attachment" && (
                            <AttachmentPicker
                                taskId={task.id}
                                isUpdating={isUpdating}
                                onClose={() => setActivePopup(null)}
                                onPatchTask={actions.patchTask}
                                currentAttachments={task.attachments || []}
                            />
                        )}
                    </div>
                ))}
                {markerToDelete && (
                    <ConfirmModal
                        title="Delete Label"
                        message="This will permanently remove the label from the entire project and all associated tasks. Proceed?"
                        confirmText="Confirm Delete"
                        cancelText="Cancel"
                        isLoading={isDeleting}
                        onConfirm={async () => {
                            setIsDeleting(true);
                            await actions.handleDeleteGlobalMarker(markerToDelete);
                            setIsDeleting(false);
                            setMarkerToDelete(null);
                        }}
                        onCancel={() => setMarkerToDelete(null)}
                    />
                )}
            </div>
        </div>
    );
};