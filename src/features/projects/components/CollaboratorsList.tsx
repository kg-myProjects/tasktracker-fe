import type {CollaboratorDto} from "../types";
import {API_URL} from "../../../config/api.ts";

interface CollaboratorsListProps {
    collaborators: CollaboratorDto[];
}

export const CollaboratorsList = ({collaborators}: CollaboratorsListProps) => {

    if (!collaborators) return null;

    return (
        <div className="flex items-center ml-4">
            <div className="flex items-center -space-x-3">
                {collaborators.map((member) => (
                    <div
                        key={member.id}
                        title={`${member.email} (${member.roles?.join(", ") ?? "No roles"})`}
                        className="w-9 h-9 rounded-full bg-cyan-300 border-2 border-cyan-500 flex items-center justify-center text-sm font-medium text-white cursor-help hover:z-10 transition-all hover:scale-120 shadow-sm overflow-hidden"
                    >
                        {member.avatarUrl ? (
                            <img
                                src={`${API_URL}${member.avatarUrl}`}
                                alt={member.email}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            member.email?.[0]?.toUpperCase() ?? "?"
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
