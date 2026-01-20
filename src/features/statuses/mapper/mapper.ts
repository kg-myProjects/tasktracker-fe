import type {TaskStatus, TaskStatusDto} from "../types"

export function mapTaskStatusFromApi(data: TaskStatusDto): TaskStatus {
    return {
        id: data.id,
        name: data.name,
        position: data.position,
        projectId: data.project.id,
    };
}
