import type {MarkerDto} from "../../tasks/types";

export interface Project {
    id: string;
    title: string;
    description: string;
    projectTeam: CollaboratorDto[];
    markers?: MarkerDto[];
    logs?: ProjectLog[];
}

export type CreateProjectDto = Omit<Project, "id" | "projectTeam" | "markers" | "logs">;

export type EditProjectDto = Pick<Project, "id" | "title" | "description">;

export interface CollaboratorDto {
    id: string;
    email: string;
    avatarUrl: string | null;
    avatarUpdatedAt: number | null;
    roles: ProjectRole[];
}

export interface ProjectsSliceState {
    projects: Project[];
    adminProjects: Project[],
    currentProject?: Project | null;
    createProjectErrorMessage?: string;
    inviteUserErrorMessage?: string;
    deleteProjectErrorMessage?: string;
    updateProjectErrorMessage?: string;
    isLoading: boolean;
    isUpdatingProject?: boolean;
}

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface InviteRequestDto {
    email: string;
    role: ProjectRole;
}

export interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role: ProjectRole) => void;
    error?: string;
}

export interface ProjectLog {
    id: string;
    entity: "Task" | "Status";
    entityName: string;
    action: ProjectLogAction;
    userEmail: string;
    userFirstName: string | null;
    userLastName: string | null;
    userAvatar: string | null;
    userAvatarUpdatedAt: number | null;
    difference: string;
    createdAt: string;
}

export type ProjectLogAction =
    | "CREATE"
    | "DELETE"
    | "MOVE"
    | "MARKERS"
    | "TITLE"
    | "DESCRIPTION"
    | "DUE_DATE";