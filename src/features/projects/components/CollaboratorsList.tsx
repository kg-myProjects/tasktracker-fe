import type {CollaboratorDto} from "../types";
import {API_URL} from "../../../config/api.ts";
import {sortCollaboratorsByRole} from "../utils/projectUtils.ts";

interface CollaboratorsListProps {
    collaborators: CollaboratorDto[];
}

export const CollaboratorsList = ({collaborators}: CollaboratorsListProps) => {

    if (!collaborators) return null;

    return (
        <div className="flex items-center ml-4">
            <div className="flex items-center -space-x-3">
                {sortCollaboratorsByRole(collaborators).map((collaborator) => (
                    <div key={collaborator.id} className="relative hover:scale-120 hover:z-10 transition-all">
                        {collaborator.roles.includes("OWNER") && (
                            <svg
                                className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M2 19h20v2H2v-2zM2 6l5 5 5-8 5 8 5-5v11H2V6z"/>
                            </svg>
                        )}
                        <div
                            className="flex
                            items-center
                            justify-center
                            w-9 h-9 rounded-full
                            bg-cyan-300
                            border-2  border-cyan-500
                            text-sm text-white font-medium shadow-sm
                            cursor-help
                            overflow-hidden"
                            title={`${collaborator.email} (BOARD ${collaborator.roles?.join(", ") ?? "No role"})`}
                        >
                            {collaborator.avatarUrl ? (
                                <img
                                    src={`${API_URL}${collaborator.avatarUrl}${collaborator.avatarUpdatedAt ? `?t=${collaborator.avatarUpdatedAt}` : ""}`}
                                    alt={collaborator.email}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                collaborator.email?.[0]?.toUpperCase() ?? "?"
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
