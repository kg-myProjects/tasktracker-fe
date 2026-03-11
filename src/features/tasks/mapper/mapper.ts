import type {Task, TaskDto} from "../types";

export function mapTaskFromApi(data: TaskDto): Task {
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        statusId: data.statusId ?? '',
        projectId: data.projectId ?? '',
        executors: data.executors || [],
        markers: data.markers || [],
        checklist: data.checklist || [],
        dueDate: data.dueDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        attachments: data.attachments || [],
        comments: data.comments || []
    };
}
