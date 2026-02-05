import { CollaboratorsList } from "./CollaboratorsList.tsx";
import type { CollaboratorDto } from "../types"; // Перевір шлях до типів

interface BoardHeaderProps {
    title: string | undefined;
    onAddStatus: () => void;
    onAddCollab: () => void;
    onOpenLogs?: () => void;
    collaborators: CollaboratorDto[] | undefined;
}

export const BoardHeader = ({ title, onAddStatus, onAddCollab, onOpenLogs, collaborators }: BoardHeaderProps) => (
    <div className="flex items-center gap-4 mb-8 text-cyan-400">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
            {title ?? "Loading..."}
        </h1>

        <div className="flex gap-2 ml-4">
            <button
                onClick={onAddStatus}
                className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-cyan-400/30 text-[10px] font-black uppercase hover:bg-cyan-400/10 hover:border-cyan-400 transition-all"
            >
                + Status
            </button>
            <button
                onClick={onAddCollab}
                className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-cyan-400/30 text-[10px] font-black uppercase hover:bg-cyan-400/10 hover:border-cyan-400 transition-all"
            >
                + Invite
            </button>

            <button
                className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-cyan-400/30 text-[10px] font-black uppercase hover:bg-cyan-400/10 hover:border-cyan-400 transition-all"
                onClick={onOpenLogs}
            >
                Project Logs
            </button>

        </div>

        {collaborators && (
            <div className="ml-auto">
                <CollaboratorsList
                    collaborators={collaborators}
                    onInviteClick={onAddCollab}
                />
            </div>
        )}
    </div>
);
