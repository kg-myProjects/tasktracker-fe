import { useAppDispatch } from "../../../app/hooks";
import { createTask } from "../../tasks/slice/tasksSlice";
import {
    createTaskStatus, deleteTaskStatus, getAllTaskStatuses
} from "../../statuses/slice/taskStatusSlice";
import { inviteUser } from "../slice/projectsSlice";
import type { ProjectRole } from "../types";

export const useKanbanActions = (projectId?: string) => {
    const dispatch = useAppDispatch();

    const handleCreateTask = async (title: string, description: string, statusId: string) => {
        if (!projectId || !statusId) return;
        await dispatch(createTask({ title, description, statusId, projectId }));
    };

    const handleCreateStatus = async (name: string, position: number) => {
        if (!projectId) return;
        await dispatch(createTaskStatus({ name, projectId, position })).unwrap();
        await dispatch(getAllTaskStatuses(projectId));
    };

    const handleDeleteStatus = async (statusId: string) => {
        if (!projectId) return;
            await dispatch(deleteTaskStatus(statusId)).unwrap();
            await dispatch(getAllTaskStatuses(projectId));
    };

    const handleInvite = async (projectId: string, email: string, role: ProjectRole) => {
        return await dispatch(inviteUser({ id: projectId, dto: { email, role } }));
    };

    return { handleCreateTask, handleCreateStatus, handleDeleteStatus, handleInvite };
};
