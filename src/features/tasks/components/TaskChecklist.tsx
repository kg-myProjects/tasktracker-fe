import { useState } from "react";
import type { ChecklistItem } from "../types";

interface TaskChecklistProps {
    items: ChecklistItem[];
    onSync: (newItems: ChecklistItem[]) => void;
    isCreating: boolean;
    onCloseCreating: () => void;
}

export const TaskChecklist = ({ items, onSync, isCreating, onCloseCreating }: TaskChecklistProps) => {
    const [newItemText, setNewItemText] = useState("");

    const completedCount = items.filter(i => i.completed).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const addItem = () => {
        if (newItemText.trim()) {
            onSync([...items, { text: newItemText, completed: false }]);
            setNewItemText("");
        }
    };

    const toggleItem = (itemToToggle: ChecklistItem) => {
        const updated = items.map(item =>
            (item.id === itemToToggle.id || item.text === itemToToggle.text)
                ? { ...item, completed: !item.completed }
                : item
        );
        onSync(updated);
    };

    const deleteItem = (itemToDelete: ChecklistItem) => {
        onSync(items.filter(item =>
            item.id ? item.id !== itemToDelete.id : item.text !== itemToDelete.text
        ));
    };

    if (items.length === 0 && !isCreating) return null;

    return (
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-in slide-in-from-left-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    ✅ Checklist <span className="text-cyan-500 bg-cyan-50 px-2 py-0.5 rounded-full">{completedCount}/{totalCount}</span>
                </label>
                <button onClick={onCloseCreating} className="text-[9px] text-slate-400 hover:text-rose-500 font-black uppercase">Hide</button>
            </div>

            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-3 group">
                        <button onClick={() => toggleItem(item)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'}`}>
                            {item.completed && <span className="text-white text-xs">✓</span>}
                        </button>
                        <span className={`text-sm font-bold flex-1 ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                        <button onClick={() => deleteItem(item)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600">✕</button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none text-black"
                    placeholder="Add an item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <button onClick={addItem} className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-md">Add</button>
            </div>
        </div>
    );
};
