import type {CollaboratorDto} from "../types";

export const sortCollaboratorsByRole = (collaborators: CollaboratorDto[]): CollaboratorDto[] => {
    return [...collaborators].sort((a, b) => {
        if (a.roles.includes("OWNER")) return -1;
        if (b.roles.includes("OWNER")) return 1;
        return 0;
    });
};