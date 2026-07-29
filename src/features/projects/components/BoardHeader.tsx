import {CollaboratorsList} from "./CollaboratorsList.tsx";
import type {CollaboratorDto} from "../types";
import type {MarkerDto} from "../../tasks/types";
import {ActionButton} from "../../../components/ui/buttons/ActionButton.tsx";

interface BoardHeaderProps {
    title: string | undefined;
    onAddStatus: () => void;
    onAddCollab: () => void;
    onOpenLogs: () => void;
    collaborators: CollaboratorDto[] | undefined;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedMarkerIds: string[];
    projectMarkers: MarkerDto[];
    onMarkerToggle: (id: string) => void;
    onDeleteBoard: () => void;
}

export const BoardHeader = ({
                                title,
                                onAddStatus,
                                onAddCollab,
                                onOpenLogs,
                                collaborators,
                                searchQuery,
                                onSearchChange,
                                projectMarkers,
                                selectedMarkerIds,
                                onMarkerToggle,
                                onDeleteBoard
                            }: BoardHeaderProps) => (

    <header className="flex flex-col gap-2 text-cyan-400">
        {/* BOARD NAME */}
        <h1 className="text-cyan-400 text-xl md:text-3xl font-black tracking-[0.2em] uppercase">
            {title ?? "Loading..."}
        </h1>
        {/* ACTIONS */}
        <div className="flex w-full gap-1">
            <ActionButton className="flex-1" onClick={onAddStatus}>
                Add Status
            </ActionButton>
            <ActionButton className="flex-1" onClick={onAddCollab}>
                Add User
            </ActionButton>
            <ActionButton className="flex-1" onClick={onOpenLogs}>
                Logs
            </ActionButton>
            <ActionButton className="flex-1" onClick={onDeleteBoard}>
                Delete
            </ActionButton>
        </div>
        {/* SEARCH / FILTER */}
        <div className="flex w-full items-center gap-2">
            {/* SEARCH */}
            <div className="relative flex flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-cyan-500/50 text-xs animate-twinkle">🔍</span>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search task..."
                    className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2 px-10 text-[10px] font-black text-cyan-100 placeholder:text-cyan-400 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all uppercase tracking-widest"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-red-500 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
            {/* FILTER */}
            {projectMarkers.length > 0 && (
                <div className="flex gap-2 items-center shrink-0">
                    {projectMarkers.map((marker) => {
                        const isSelected = selectedMarkerIds?.includes(marker.id) ?? false;
                        return (
                            <button
                                key={marker.id}
                                onClick={() => onMarkerToggle(marker.id)}
                                title={marker.name}

                                className={`relative w-5 h-5 rounded-md border-2 transition-all hover:scale-120
                            ${marker.color}
                            ${
                                    isSelected
                                        ? "border-white scale-120 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                                        : "border-transparent opacity-40 hover:opacity-100"
                                }
                        `}
                            >
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
        {/* COLLABORATORS */}
        {collaborators && (
            <div className="my-4 flex items-center justify-end">
                <h1 className="text-[10px] md:text-[12px] text-neon font-black uppercase">
                    Board members:
                </h1>
                <CollaboratorsList collaborators={collaborators}/>
            </div>
        )}
    </header>
);