import { useState } from "react";
import List from "../components/List";
import CardModal from "../components/List/CardModal";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

interface Column {
  id: string;
  title: string;
  cards: Array<{ id: string; title: string; description: string }>;
}

export default function Home() {
    usePageTitle("TrackerApp");
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", title: "To Do", cards: [] },
  ]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<{ id: string; title: string; description: string } | null>(null);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: newListTitle.trim(),
        cards: [],
      };
      setColumns([...columns, newColumn]);
      setNewListTitle("");
    }
  };

  const handleUpdateCards = (columnId: string, cards: Column["cards"]) => {
    setColumns(
      columns.map((col) => (col.id === columnId ? { ...col, cards } : col))
    );
  };

  return (
    <>
        <h2 className="text-cyan-400 text-2xl font-bold">Welcome to the Tracker App!</h2>
        <h4 className="text-cyan-400 text-lg"> On this page, you can try creating columns for task statuses and adding task cards to them.</h4>
        <h4 className="text-cyan-400 text-lg"> You can create a real project in the Projects tab. Good luck!</h4>
      <div className="flex flex-row gap-6 p-8 items-start">
        {columns.map((column) => (
          <List
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            onUpdateCards={handleUpdateCards}
            onCardClick={setSelectedCard}
          />
        ))}
      {isAddingList ? (
        <div className="w-[300px] bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter the column name (task status)..."
            className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 placeholder:text-slate-400 font-bold border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-none transition-all mb-4"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddList();
              } else if (e.key === "Escape") {
                setIsAddingList(false);
                setNewListTitle("");
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddList}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-xs font-black rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all uppercase"
            >
              Add column (task status)
            </button>
            <button
              onClick={() => {
                setIsAddingList(false);
                setNewListTitle("");
              }}
              className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingList(true)}
          className="w-[300px] h-fit bg-white/5 backdrop-blur-md rounded-2xl border-2 border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all p-5 text-center font-bold"
        >
          + Add column (task status)
        </button>
      )}
      </div>
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </>
  );
}