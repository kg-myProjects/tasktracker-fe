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

// дто без id
export type CreateTaskStatusDto = Omit<TaskStatus, "id">;

export interface UpdateTaskStatusDto {
    id: string;
    position: number;
}

export interface TaskStatusSliceState {
    taskStatuses: TaskStatus[];
    createTaskStatusErrorMessage?: string;
    isLoading: boolean;
}
