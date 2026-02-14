import type {MarkerDto} from "../../tasks/types";

export interface Project {
    id: string;
    title: string;
    description: string;
    owner: EmployeeDto;
    projectTeam: CollaboratorDto[];
    markers?: MarkerDto[];
    logs?: ProjectLog[];
}

// дто без id
export type CreateProjectDto = Omit<Project, "id" | "owner" | "projectTeam">;

export interface CollaboratorDto {
    id: string;
    email: string;
    roles: ProjectRole[];
}

export interface EmployeeDto {
    id: string;
    email: string;
}


export interface ProjectsSliceState {
    projects: Project[];
    adminProjects: Project[],
    currentProject?: Project | null;
    createProjectErrorMessage?: string;
    inviteUserErrorMessage?: string;
    deleteProjectErrorMessage?: string;
    isLoading: boolean;
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
    entity: "Task" | "Status";
    entityName: string;
    action: "CREATE" | "DELETE";
    userEmail: string;
    userNickname?: string;
    userAvatar?: string;
    difference: string;
    createdAt: string;
}
