import { useState } from "react";

interface Card {
  id: string;
  title: string;
  description: string;
}

interface ListProps {
  id: string;
  title: string;
  cards: Card[];
  onUpdateCards: (columnId: string, cards: Card[]) => void;
  onCardClick?: (card: Card) => void;
}

export default function List({ id, title, cards, onUpdateCards, onCardClick }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard: Card = {
        id: Date.now().toString(),
        title: newCardTitle.trim(),
        description: "",
      };
      onUpdateCards(id, [...cards, newCard]);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="w-[300px] flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500 ease-out hover:scale-105 hover:z-10 hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] overflow-hidden">
      
      <div className="p-1.5">
        <div className="bg-cyan-500/90 rounded-xl p-3 flex justify-between items-center border-2 border-[#0f172a] shadow-[inset_0_0_15px_rgba(255,255,255,0.3)]">
          <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase drop-shadow-md">
            {title}
          </h2>
          <button className="text-white/80 hover:text-white transition-colors text-xl font-bold">•••</button>
        </div>
      </div>

      <div className="px-3 py-4 space-y-3 min-h-[100px] bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-900/40 backdrop-contrast-125">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card)}
            className="bg-white rounded-xl p-4 border-2 border-transparent shadow-lg hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer group"
          >
            <p className="text-sm text-[#0f172a] font-bold">
              {card.title}
            </p>
          </div>
        ))}

        {isAddingCard && (
          <div className="bg-white rounded-xl p-3 border-2 border-cyan-500 shadow-[0_0_25px_rgba(255,255,255,0.2)] animate-in zoom-in-95 duration-200">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Назовите карточку..."
              className="w-full px-2 py-1 text-sm text-[#0f172a] font-bold focus:outline-none bg-transparent placeholder:text-slate-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") setIsAddingCard(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="px-3 py-3 border-t border-cyan-500/10 bg-slate-900/20">
        {!isAddingCard ? (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full text-center text-xs text-cyan-400 font-black py-2.5 rounded-xl border border-cyan-400/30 bg-cyan-400/5 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <span className="text-lg">+</span> Добавить карточку
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black py-2.5 rounded-lg border border-[#0f172a] shadow-lg transition-all uppercase"
            >
              СОХРАНИТЬ
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="px-3 py-2 text-slate-400 hover:text-white text-[10px] font-black transition-colors uppercase"
            >
              ОТМЕНА
            </button>
          </div>
        )}
      </div>
    </div>
  );
}