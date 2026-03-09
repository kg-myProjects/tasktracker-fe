export interface TaskStatus {
    id: string;
    name: string;
    position: number;
    projectId: string;
}

export interface TaskStatusDto{
    id: string;
    name: string;
    position: number;
    projectId: string;
}

// дто без id
export type CreateTaskStatusDto = Omit<TaskStatus, "id">;

export interface UpdateTaskStatusDto {
    id: string;
    name?: string;
    position?: number;
}

export interface TaskStatusSliceState {
    taskStatuses: TaskStatus[];
    errorMessage: string;
    isLoading: boolean;
}
