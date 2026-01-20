
export interface Task {
    id: string;
    title: string;
    description: string;
    statusId: string;
    projectId: string;

}

// дто без id
export type CreateTaskDto = Omit<Task, "id">;

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

}
// tasks/types.ts
// tasks/types.ts
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    statusId?: string;
    projectId?: string;
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
