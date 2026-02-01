import { useState } from "react";

interface CardModalProps {
  card: { id: string; title: string; description: string };
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  // --- СОСТОЯНИЯ ---
  const [description, setDescription] = useState(card.description); // Добавили стейт для описания
  const [showLabels, setShowLabels] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState<{title: string, items: {id: number, text: string, completed: boolean}[]} | null>(null);
  const [newItemText, setNewItemText] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<number | null>(20);
  const [dueDate, setDueDate] = useState<number | null>(31);
  const [tempTime, setTempTime] = useState("11:13");
  const [selectedFullDate, setSelectedFullDate] = useState<{range: string, time: string, reminder: string} | null>(null);
  const [hasStartDate, setHasStartDate] = useState(true);
  const [hasDueDate, setHasDueDate] = useState(true);
  const [reminder, setReminder] = useState("1 day before");

  const availableLabels = [
    { id: "fe", color: "bg-cyan-500", text: "FE" },
    { id: "be", color: "bg-slate-900", text: "BE" },
    { id: "qa", color: "bg-orange-500", text: "QA" },
    { id: "design", color: "bg-blue-600", text: "DESIGN" },
  ];

  // --- ЛОГИКА ---
  const handleSave = () => {
    // В задаче №77 мы добавим сюда отправку на бэкенд
    console.log("Saving card data:", {
      id: card.id,
      description: description,
      labels: selectedLabels,
      dates: selectedFullDate,
      checklist: activeChecklist
    });
    onClose(); // Закрываем после сохранения
  };

  const handleDateClick = (day: number) => {
    if (!startDate || (startDate && dueDate)) {
      setStartDate(day);
      setDueDate(null);
    } else {
      if (day < startDate) {
        setDueDate(startDate);
        setStartDate(day);
      } else {
        setDueDate(day);
      }
    }
  };

  const toggleLabel = (id: string) => {
    setSelectedLabels(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const toggleItem = (id: number) => {
    if (activeChecklist) {
      setActiveChecklist({
        ...activeChecklist,
        items: activeChecklist.items.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
      });
    }
  };

  const addItem = () => {
    if (newItemText.trim() && activeChecklist) {
      setActiveChecklist({
        ...activeChecklist,
        items: [...activeChecklist.items, { id: Date.now(), text: newItemText, completed: false }]
      });
      setNewItemText("");
    }
  };

  const createChecklist = () => {
    if (checklistTitle.trim()) {
      setActiveChecklist({ title: checklistTitle, items: [] });
      setIsCreatingChecklist(false);
      setChecklistTitle("");
    }
  };

  const progress = activeChecklist?.items.length 
    ? Math.round((activeChecklist.items.filter(i => i.completed).length / activeChecklist.items.length) * 100) 
    : 0;

  const actionButtons = [
    { id: 'members', label: 'Members', icon: '👤' },
    { id: 'labels', label: 'Labels', icon: '🏷', action: () => setShowLabels(!showLabels) },
    { id: 'checklist', label: 'Checklist', icon: '✅', action: () => setIsCreatingChecklist(!isCreatingChecklist) },
    { id: 'dates', label: 'Dates', icon: '📅', action: () => setShowDatePicker(!showDatePicker) },
    { id: 'attachment', label: 'Attachment', icon: '📎' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] w-full max-w-2xl my-8 transform animate-in zoom-in-95 duration-300 relative min-h-fit" onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{card.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-cyan-500 transition-all text-2xl font-bold">✕</button>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8 bg-white min-h-fit text-slate-800">
          <div className="flex-1 space-y-6 text-left">
            
            <div className="flex flex-wrap gap-4 items-start min-h-[40px]">
               {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLabels.map(id => (
                    <span key={id} className={`${availableLabels.find(l => l.id === id)?.color} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-sm`}>
                      {availableLabels.find(l => l.id === id)?.text}
                    </span>
                  ))}
                </div>
              )}

              {selectedFullDate && (
                <div className="space-y-1 cursor-pointer group" onClick={() => setShowDatePicker(true)}>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Due Date</p>
                  <div className="flex flex-col gap-1 bg-white border-2 border-cyan-500/10 px-3 py-2 rounded-xl shadow-sm group-hover:border-cyan-500 transition-all">
                     <div className="flex items-center gap-2">
                        <span className="text-cyan-600 text-[10px] font-black uppercase">📅 {selectedFullDate.range} at {selectedFullDate.time}</span>
                        <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">On Time</span>
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-cyan-600 uppercase tracking-widest px-1">📝 Description</label>
              <textarea 
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 min-h-[120px] text-slate-800 focus:bg-white focus:border-cyan-400 transition-all outline-none shadow-inner placeholder:text-slate-300 text-sm" 
                placeholder="Add a more detailed description..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {activeChecklist && (
              <div className="space-y-4 pt-4 border-t border-slate-100 animate-in slide-in-from-left-4">
                {/* ... Checklist UI ... */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">✅ {activeChecklist.title}</label>
                  <button onClick={() => setActiveChecklist(null)} className="text-[9px] text-rose-500 hover:bg-rose-500 hover:text-white px-3 py-1 rounded-lg font-black transition-all uppercase">Delete</button>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="space-y-2">
                  {activeChecklist.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleItem(item.id)}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-200 group-hover:border-cyan-400'}`}>
                        {item.completed && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className={`text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-slate-50 border-2 border-transparent rounded-xl px-3 py-2 text-sm focus:bg-white focus:border-cyan-400 outline-none text-slate-800 transition-all" placeholder="Add an item..." value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()}/>
                  <button onClick={addItem} className="bg-cyan-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md hover:bg-cyan-400 transition-all">Add</button>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-6 border-t border-slate-100">
              <button 
                onClick={handleSave}
                className="bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black px-8 py-3.5 rounded-2xl border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all uppercase shadow-lg shadow-cyan-500/20"
              >
                Save
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-[10px] font-black px-6 py-3.5 uppercase">Cancel</button>
            </div>
          </div>

          <div className="w-full md:w-56 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-left">Add to card</h3>
            <div className="flex flex-col gap-2 relative">
              {actionButtons.map((btn) => (
                <div key={btn.id} className="relative">
                  <button onClick={btn.action} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-cyan-400 rounded-xl text-[10px] font-bold text-slate-600 hover:text-cyan-600 transition-all flex items-center gap-3 group">
                    <span className="text-base transition-transform group-hover:scale-110">{btn.icon}</span>
                    {btn.label}
                  </button>

                  {btn.id === 'dates' && showDatePicker && (
                    <div className="absolute left-0 top-full mt-2 w-[300px] md:-left-20 bg-white border-2 border-cyan-500 rounded-2xl shadow-2xl p-5 z-[100] animate-in zoom-in-95 duration-200">
                       <p className="text-[10px] font-black text-cyan-600 uppercase mb-4 text-center tracking-widest border-b border-slate-50 pb-2">Set Dates</p>
                       <div className="bg-slate-50 rounded-xl p-3 mb-5">
                          <div className="flex justify-between items-center text-slate-700 mb-3 px-1 text-[10px] font-black uppercase">
                             <button className="hover:text-cyan-500 transition-colors">‹</button>
                             <span>January 2026</span>
                             <button className="hover:text-cyan-500 transition-colors">›</button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center">
                             {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                               <span key={d} className="text-[8px] font-black text-slate-400 uppercase mb-1">{d}</span>
                             ))}
                             {Array.from({length: 31}).map((_, i) => {
                               const day = i + 1;
                               const isStart = day === startDate;
                               const isDue = day === dueDate;
                               const isInRange = startDate && dueDate && day > startDate && day < dueDate;
                               return (
                                 <button key={i} onClick={() => handleDateClick(day)} className={`text-[10px] font-bold py-1.5 rounded-lg transition-all relative ${isStart || isDue ? 'bg-cyan-500 text-white shadow-md z-10' : isInRange ? 'bg-cyan-50 text-cyan-500 rounded-none' : 'text-slate-500 hover:bg-white hover:text-cyan-500'}`}>{day}</button>
                               );
                             })}
                          </div>
                       </div>
                       <div className="space-y-4 mb-6">
                          <div className="flex flex-col gap-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hasStartDate} onChange={() => setHasStartDate(!hasStartDate)} className="accent-cyan-500 w-4 h-4 rounded" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Start Date</span>
                             </label>
                             {hasStartDate && (
                               <input type="text" value={startDate ? `${startDate < 10 ? '0'+startDate : startDate}.01.2026` : ""} readOnly className="bg-slate-50 border-2 border-transparent text-[11px] text-slate-800 font-black px-3 py-2 rounded-lg w-full outline-none focus:border-cyan-400 transition-all" />
                             )}
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hasDueDate} onChange={() => setHasDueDate(!hasDueDate)} className="accent-cyan-500 w-4 h-4 rounded" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Due Date</span>
                             </label>
                             {hasDueDate && (
                               <div className="flex gap-2">
                                  <input type="text" value={dueDate ? `${dueDate < 10 ? '0'+dueDate : dueDate}.01.2026` : ""} readOnly className="bg-slate-50 border-2 border-transparent text-[11px] text-slate-800 font-black px-3 py-2 rounded-lg flex-1 outline-none focus:border-cyan-400 transition-all" />
                                  <input type="text" value={tempTime} onChange={(e) => setTempTime(e.target.value)} className="bg-slate-50 border-2 border-transparent text-[11px] text-slate-800 font-black px-2 py-2 rounded-lg w-16 outline-none text-center focus:border-cyan-400 transition-all" />
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <button onClick={() => { const range = `${startDate ? startDate+' Jan' : ''}${startDate && dueDate ? ' - ' : ''}${dueDate ? dueDate+' Jan' : ''}`; setSelectedFullDate({range, time: tempTime, reminder}); setShowDatePicker(false); }} className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all active:scale-95">Save</button>
                          <button onClick={() => { setSelectedFullDate(null); setStartDate(null); setDueDate(null); setShowDatePicker(false); }} className="w-full bg-slate-100 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase hover:text-rose-500 transition-all">Remove</button>
                       </div>
                    </div>
                  )}

                  {/* ... Labels & Checklist Popups ... */}
                  {btn.id === 'labels' && showLabels && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1 text-left">Labels</p>
                       {availableLabels.map(l => (
                        <button key={l.id} onClick={() => toggleLabel(l.id)} className={`w-full h-9 mb-1.5 rounded-lg flex items-center px-3 text-[10px] font-black text-white uppercase transition-all hover:scale-105 ${l.color} ${selectedLabels.includes(l.id) ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}`}>{l.text}</button>
                      ))}
                    </div>
                  )}

                  {btn.id === 'checklist' && isCreatingChecklist && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-4 z-40 animate-in slide-in-from-top-2 text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 italic">Create Checklist</p>
                      <input className="w-full bg-slate-50 border-2 border-transparent rounded-lg p-2.5 text-xs mb-3 outline-none focus:bg-white focus:border-cyan-400 shadow-inner text-slate-800" placeholder="Title..." value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} autoFocus />
                      <button onClick={createChecklist} className="w-full bg-cyan-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-cyan-400 transition-all">Add</button>
                    </div>
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