import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {addExecutorToTask, updateTask} from "../slice/tasksSlice.ts";

import type { Task } from "../types";

interface TaskEditModalProps {
    card: Task;
    onClose: () => void;
}


export function EditTaskModal({card, onClose}: TaskEditModalProps) {
    const [showLabels, setShowLabels] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [checklistTitle, setChecklistTitle] = useState("");
    const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
    const [activeChecklist, setActiveChecklist] = useState<{
        title: string,
        items: { id: number, text: string, completed: boolean }[]
    } | null>(null);
    const [newItemText, setNewItemText] = useState("");
    const [description, setDescription] = useState(card.description || "");
    const [title, setTitle] = useState(card.title || "");
    const [showMembers, setShowMembers] = useState(false);

    const project = useAppSelector((state) => state.projects.currentProject);
    const projectMembers = project?.projectTeam || [];

    const availableLabels = [
        {id: "frontend", color: "bg-cyan-500", text: "Frontend"},
        {id: "backend", color: "bg-slate-900", text: "Backend"},
        {id: "esoteric", color: "bg-purple-600", text: "Esoteric"},
        {id: "urgent", color: "bg-rose-500", text: "Urgent"},
    ];

    const toggleLabel = (id: string) => {
        setSelectedLabels(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    };

    const createChecklist = () => {
        if (checklistTitle.trim()) {
            setActiveChecklist({title: checklistTitle, items: []});
            setIsCreatingChecklist(false);
            setChecklistTitle("");
        }
    };

    const addItem = () => {
        if (newItemText.trim() && activeChecklist) {
            setActiveChecklist({
                ...activeChecklist,
                items: [...activeChecklist.items, {id: Date.now(), text: newItemText, completed: false}]
            });
            setNewItemText("");
        }
    };

    const toggleItem = (id: number) => {
        if (activeChecklist) {
            setActiveChecklist({
                ...activeChecklist,
                items: activeChecklist.items.map(item => item.id === id ? {...item, completed: !item.completed} : item)
            });
        }
    };

    const progress = activeChecklist?.items.length
        ? Math.round((activeChecklist.items.filter(i => i.completed).length / activeChecklist.items.length) * 100)
        : 0;


    const actionButtons = [
        {id: 'members', label: 'Collaborators', icon: '👤', action: () => setShowMembers(!showMembers)},
        {id: 'labels', label: 'Markers', icon: '🏷', action: () => setShowLabels(!showLabels)},
        {id: 'checklist', label: 'Checklist', icon: '✅', action: () => setIsCreatingChecklist(!isCreatingChecklist)},
        {id: 'dates', label: 'Dates', icon: '📅'},
        {id: 'attachment', label: 'Attachments', icon: '📎'},
    ];

    const dispatch = useAppDispatch();

    const handleSave = () => {
        dispatch(updateTask({
            id: card.id,
            dto: {
                title: title,
                description: description,
            }
        }));
        onClose();
    };

    const handleAddExecutor = (collaboratorId: string) => {
        dispatch(addExecutorToTask({ collaboratorId, taskId: card.id }));
        setShowMembers(false);
    };


    return (
        <div
            className="fixed inset-0 bg-[#0f172a]/95 z-50 flex items-start justify-center p-4 overflow-y-auto animate-in fade-in duration-300"
            onClick={onClose}>
            <div
                className="bg-white rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)] w-full max-w-2xl my-8 transform animate-in zoom-in-95 duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}>

                {/* Шапка */}
                <div
                    className="bg-cyan-500 px-6 py-4 flex items-center justify-between border-b-2 border-[#0f172a] sticky top-0 z-30 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-8 bg-[#0f172a] rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-transparent text-xl font-black text-white uppercase outline-none focus:border-b border-white/50"
                            />
                        </h2>
                    </div>
                    <button onClick={onClose}
                            className="text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 text-2xl font-bold">✕
                    </button>
                </div>

                {/* Основной контейнер — резиновый min-h-fit */}
                <div className="p-8 flex flex-col md:flex-row gap-8 bg-slate-50 min-h-fit relative">

                    <div className="flex-1 space-y-6">
                        {/* Выбранные метки */}
                        {selectedLabels.length > 0 && (
                            <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                                {selectedLabels.map(id => (
                                    <span key={id}
                                          className={`${availableLabels.find(l => l.id === id)?.color} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-sm`}>
                    {availableLabels.find(l => l.id === id)?.text}
                  </span>
                                ))}
                            </div>
                        )}

                        {card.executors && card.executors.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                    Members
                                </label>
                                <div className="flex -space-x-2">
                                    {card.executors.map((ex) => (
                                        <div
                                            key={ex.id}
                                            title={ex.email}
                                            className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-[11px] font-black uppercase shadow-sm hover:scale-110 transition-transform cursor-help"
                                        >
                                            {ex.email ? ex.email.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setShowMembers(!showMembers)}
                                        className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-500 text-lg hover:bg-slate-300 transition-colors ml-2"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}



                        {/* Описание */}
                        <div className="space-y-2">
                            <label
                                className="text-[10px] font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">📝
                                Описание</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 min-h-[100px] text-slate-800 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                                placeholder="Add description..."
                            />
                        </div>

                        {/* Активный Чек-лист */}
                        {activeChecklist && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in slide-in-from-left-4">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-[10px] font-black text-slate-800 uppercase tracking-widest">✅ {activeChecklist.title}</label>
                                    <button onClick={() => setActiveChecklist(null)}
                                            className="text-[9px] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white px-3 py-1 rounded-lg font-black transition-all uppercase">Удалить
                                    </button>
                                </div>

                                <div
                                    className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                                    <div
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-700"
                                        style={{width: `${progress}%`}}></div>
                                </div>

                                <div className="space-y-2">
                                    {activeChecklist.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 cursor-pointer group"
                                             onClick={() => toggleItem(item.id)}>
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-cyan-500 border-cyan-500 shadow-sm' : 'bg-white border-slate-300 group-hover:border-cyan-400'}`}>
                                                {item.completed && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none"
                                        placeholder="Add element..." value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addItem()}/>
                                    <button onClick={addItem}
                                            className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-md">Add
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-6 border-t border-slate-200/50">
                            <button onClick={handleSave}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black px-8 py-3 rounded-xl border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all uppercase">Save
                            </button>
                            <button onClick={onClose}
                                    className="text-slate-400 hover:text-slate-600 text-[10px] font-black px-6 py-3 uppercase">Cancel
                            </button>
                        </div>
                    </div>

                    {/* Боковая панель — Новое Меню «Добавить на карточку» */}
                    <div className="w-full md:w-56 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Add on
                            card</h3>
                        <div className="flex flex-col gap-2 relative">

                            {actionButtons.map((btn) => (
                                <div key={btn.id} className="relative">
                                    <button
                                        onClick={()=>btn.action?.( )}
                                        className="w-full text-left px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-lg transition-all flex items-center gap-3 group"
                                    >
                                        <span
                                            className="text-base transition-transform group-hover:scale-120">{btn.icon}</span>
                                        {btn.label}
                                    </button>

                                    {/* Окно Метки */}
                                    {btn.id === 'labels' && showLabels && (
                                        <>
                                            {/* 1. Добавляем невидимый слой на весь экран */}
                                            <div
                                                className="fixed inset-0 z-30 cursor-default"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowLabels(false);
                                                }}
                                            />

                                            <div
                                                className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1">Markers</p>
                                                {availableLabels.map(l => (
                                                    <button key={l.id} onClick={() => toggleLabel(l.id)}
                                                            className={`w-full h-9 mb-1.5 rounded-lg flex items-center px-3 text-[10px] font-black text-white uppercase transition-all hover:scale-105 ${l.color} ${selectedLabels.includes(l.id) ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}>{l.text}</button>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Окно Чек-лист */}
                                    {btn.id === 'checklist' && isCreatingChecklist && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsCreatingChecklist(false);
                                                }}
                                            />
                                            <div
                                                className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-4 z-40 animate-in slide-in-from-top-2">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-3 italic">Создать
                                                    checklist</p>
                                                <input
                                                    className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-xs mb-3 outline-none focus:border-cyan-400 shadow-inner"
                                                    placeholder="Заголовок..." value={checklistTitle}
                                                    onChange={(e) => setChecklistTitle(e.target.value)} autoFocus/>
                                                <button onClick={createChecklist}
                                                        className="w-full bg-cyan-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-cyan-400 transition-all">Add
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Окно Участники (Collaborators) */}
                                    {btn.id === 'members' && showMembers && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowMembers(false);
                                                }}
                                            />
                                            <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1 italic text-center">
                                                    Project Team
                                                </p>
                                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                                    {projectMembers?.map((member) => {
                                                        console.log("Member object:", member);
                                                        return (
                                                            <button
                                                                key={member.userId}
                                                                onClick={() => handleAddExecutor(member.userId)}
                                                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-cyan-50 border-2 border-transparent hover:border-cyan-100 transition-all group text-left"
                                                            >
                                                                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                                                    {member.email.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-700 truncate">
                                {member.email}
                            </span>
                                                                </div>
                                                                {/* Галочка, если уже добавлен */}
                                                                {card.executors?.some(ex => ex.id === member.userId) && (
                                                                    <span className="ml-auto text-cyan-500 font-bold text-xs">✓</span>
                                                                )}
                                                            </button>
                                                        )  })}
                                                    {(!projectMembers || projectMembers.length === 0) && (
                                                        <p className="text-[9px] text-slate-400 text-center py-2">No members found</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>

                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}