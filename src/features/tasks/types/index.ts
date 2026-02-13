import type {CollaboratorDto} from "../../projects/types";

export interface Task {
    id: string;
    title: string;
    description: string;
    statusId: string;
    projectId: string;
    executors: CollaboratorDto[];
    markers: MarkerDto[];
    checklist: ChecklistItem[];
    dueDate?: string | null;

}

export interface CreateTaskDto {
    title: string;
    description: string;
    statusId: string;
    projectId: string;
}

export interface TaskDto{
    id: string;
    title: string;
    description: string;
    status:{
        id: string;
        name: string;
        position: number;
        project: {
            id: string;
            title: string;
            description: string;
            owner:{
                id: string;
                name: string;
                email: string;
                avatar: string;
                roles:{
                    name: string;
                } ;
            }
        }

    }
    project: {
        id: string;
        title: string;
        description: string;
        owner:{
            id: string;
            name: string;
            email: string;
            avatar: string;
            roles:{
                name: string;
            } ;
        }
    }
    executors: CollaboratorDto[];
    markers: MarkerDto[];
    checklist: ChecklistItem[];
    dueDate?: string | null;

}



export interface UpdateTaskDto {
    title?: string;
    description?: string;
    statusId?: string;
    projectId?: string;
    executorIds?: string[];
    markerIds?: string[];
    checklist?: ChecklistItem[];
    dueDate?: string | null;
}

export interface UpdateTaskPayload {
    id: string;
    dto: UpdateTaskDto;
}
export type UpdateTaskStatusDto = { statusId: string };


export interface TasksSliceState {
    tasks: Task[];
    currentTask?: Task | null;
    createTaskErrorMessage?: string;
    isLoading: boolean;
}

export interface EmployeeDto {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface MarkerDto {
    id: string;
    name: string;
    color: string;
}
export interface ChecklistItem {
    id?: string;
    text: string;
    completed: boolean;
}
