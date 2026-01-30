import { useState } from "react";

interface CardModalProps {
  card: { id: string; title: string; description: string };
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
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
      <div className="bg-white rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)] w-full max-w-2xl my-8 transform animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-cyan-500 px-6 py-4 flex items-center justify-between border-b-2 border-[#0f172a] sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-[#0f172a] rounded-full"></div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">{card.title}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-all text-2xl font-bold">✕</button>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8 bg-slate-50 min-h-fit relative text-slate-800">
          <div className="flex-1 space-y-6 text-left">
            
            <div className="flex flex-wrap gap-4 items-start min-h-[40px]">
               {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                  {selectedLabels.map(id => (
                    <span key={id} className={`${availableLabels.find(l => l.id === id)?.color} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-sm`}>
                      {availableLabels.find(l => l.id === id)?.text}
                    </span>
                  ))}
                </div>
              )}

              {selectedFullDate && (
                <div className="space-y-1 animate-in zoom-in-95 cursor-pointer" onClick={() => setShowDatePicker(true)}>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Due Date</p>
                  <div className="flex flex-col gap-1 bg-white border-2 border-cyan-500/20 px-3 py-2 rounded-lg shadow-sm hover:border-cyan-500 transition-all">
                     <div className="flex items-center gap-2">
                        <span className="text-cyan-600 text-[10px] font-black uppercase">📅 {selectedFullDate.range} at {selectedFullDate.time}</span>
                        <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">On Time</span>
                     </div>
                     {selectedFullDate.reminder !== "None" && (
                        <span className="text-[8px] text-slate-400 font-bold uppercase flex items-center gap-1">🔔 {selectedFullDate.reminder}</span>
                     )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-cyan-600 uppercase tracking-widest px-1 flex items-center gap-2">📝 Description</label>
              <textarea className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 min-h-[100px] text-slate-800 focus:border-cyan-400 transition-all outline-none shadow-inner placeholder:text-slate-300" placeholder="Add a more detailed description..." />
            </div>

            {activeChecklist && (
              <div className="space-y-4 pt-4 border-t border-slate-200 animate-in slide-in-from-left-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">✅ {activeChecklist.title}</label>
                  <button onClick={() => setActiveChecklist(null)} className="text-[9px] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white px-3 py-1 rounded-lg font-black transition-all uppercase">Delete</button>
                </div>
                
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                  <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-700" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-2">
                  {activeChecklist.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleItem(item.id)}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-cyan-500 border-cyan-500 shadow-sm' : 'bg-white border-slate-300 group-hover:border-cyan-400'}`}>
                        {item.completed && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input className="flex-1 bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none text-slate-800" placeholder="Add an item..." value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()}/>
                  <button onClick={addItem} className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-md">Add</button>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-6 border-t border-slate-200/50">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black px-8 py-3 rounded-xl border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">Save</button>
              <button className="text-slate-400 hover:text-slate-600 text-[10px] font-black px-6 py-3 uppercase">Cancel</button>
            </div>
          </div>

          <div className="w-full md:w-56 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-left">Add to card</h3>
            <div className="flex flex-col gap-2 relative">
              {actionButtons.map((btn) => (
                <div key={btn.id} className="relative">
                  <button onClick={btn.action} className="w-full text-left px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-all flex items-center gap-3 group">
                    <span className="text-base transition-transform group-hover:scale-120">{btn.icon}</span>
                    {btn.label}
                  </button>

                  {btn.id === 'dates' && showDatePicker && (
                    <div className="absolute left-0 top-full mt-2 w-[300px] md:-left-20 bg-[#0f172a] border-2 border-cyan-500 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.5)] p-5 z-50 animate-in zoom-in-95 duration-200">
                       <p className="text-[10px] font-black text-cyan-400 uppercase mb-4 text-center tracking-widest border-b border-cyan-500/20 pb-2">Set Dates</p>
                       <div className="bg-slate-900/80 rounded-xl p-3 border border-white/10 mb-5 shadow-inner">
                          <div className="flex justify-between items-center text-white mb-3 px-1 text-[10px] font-black uppercase">
                             <button className="hover:text-cyan-400 transition-colors">‹</button>
                             <span>January 2026</span>
                             <button className="hover:text-cyan-400 transition-colors">›</button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center">
                             {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                               <span key={d} className="text-[7px] font-black text-slate-600 uppercase mb-1">{d}</span>
                             ))}
                             {Array.from({length: 31}).map((_, i) => {
                               const day = i + 1;
                               const isStart = day === startDate;
                               const isDue = day === dueDate;
                               const isInRange = startDate && dueDate && day > startDate && day < dueDate;
                               return (
                                 <button key={i} onClick={() => handleDateClick(day)} className={`text-[10px] font-bold py-1.5 rounded-lg transition-all relative ${isStart || isDue ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10' : isInRange ? 'bg-cyan-500/20 text-cyan-400 rounded-none' : 'text-slate-400 hover:bg-white/10 hover:text-cyan-400'}`}>{day}</button>
                               );
                             })}
                          </div>
                       </div>
                       <div className="space-y-4 mb-6">
                          <div className="flex flex-col gap-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hasStartDate} onChange={() => setHasStartDate(!hasStartDate)} className="accent-cyan-500 w-4 h-4 rounded" />
                                <span className="text-[9px] font-black text-slate-300 uppercase">Start Date</span>
                             </label>
                             {hasStartDate && (
                               <input type="text" value={startDate ? `${startDate < 10 ? '0'+startDate : startDate}.01.2026` : ""} readOnly className="bg-slate-800 border-2 border-cyan-500/50 text-[12px] !text-white font-black px-3 py-1.5 rounded-lg w-full outline-none shadow-md" style={{color: 'white'}} />
                             )}
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hasDueDate} onChange={() => setHasDueDate(!hasDueDate)} className="accent-cyan-500 w-4 h-4 rounded" />
                                <span className="text-[9px] font-black text-slate-300 uppercase">Due Date</span>
                             </label>
                             {hasDueDate && (
                               <div className="flex gap-2">
                                  <input type="text" value={dueDate ? `${dueDate < 10 ? '0'+dueDate : dueDate}.01.2026` : ""} readOnly className="bg-slate-800 border-2 border-cyan-500/50 text-[12px] !text-white font-black px-3 py-1.5 rounded-lg flex-1 outline-none shadow-md" style={{color: 'white'}} />
                                  <input type="text" value={tempTime} onChange={(e) => setTempTime(e.target.value)} className="bg-slate-800 border-2 border-cyan-500/50 text-[12px] !text-white font-black px-3 py-1.5 rounded-lg w-16 outline-none text-center shadow-md focus:border-cyan-400" style={{color: 'white'}} />
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="mb-6">
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">Reminder</p>
                          <select value={reminder} onChange={(e) => setReminder(e.target.value)} className="w-full bg-slate-800 border-2 border-cyan-500/50 text-[11px] !text-white font-black px-3 py-2 rounded-lg outline-none cursor-pointer appearance-none shadow-md" style={{color: 'white'}}>
                             <option className="bg-slate-900">1 day before</option>
                             <option className="bg-slate-900">At time of due date</option>
                             <option className="bg-slate-900">None</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-2">
                          <button onClick={() => { const range = `${startDate ? startDate+' Jan' : ''}${startDate && dueDate ? ' - ' : ''}${dueDate ? dueDate+' Jan' : ''}`; setSelectedFullDate({range, time: tempTime, reminder}); setShowDatePicker(false); }} className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95">Save</button>
                          <button onClick={() => { setSelectedFullDate(null); setStartDate(null); setDueDate(null); setShowDatePicker(false); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase transition-all">Remove</button>
                       </div>
                    </div>
                  )}

                  {btn.id === 'labels' && showLabels && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-3 z-40 animate-in zoom-in-95">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-3 px-1 text-left">Labels</p>
                       {availableLabels.map(l => (
                        <button key={l.id} onClick={() => toggleLabel(l.id)} className={`w-full h-9 mb-1.5 rounded-lg flex items-center px-3 text-[10px] font-black text-white uppercase transition-all hover:scale-105 ${l.color} ${selectedLabels.includes(l.id) ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}>{l.text}</button>
                      ))}
                    </div>
                  )}

                  {btn.id === 'checklist' && isCreatingChecklist && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border-2 border-cyan-400 rounded-2xl shadow-2xl p-4 z-40 animate-in slide-in-from-top-2 text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 italic">Create Checklist</p>
                      <input className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-xs mb-3 outline-none focus:border-cyan-400 shadow-inner text-slate-800" placeholder="Title..." value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} autoFocus />
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