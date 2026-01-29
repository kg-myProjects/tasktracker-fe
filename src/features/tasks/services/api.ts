import axiosInstance from "../../../lib/axiosInstance";
import type {CreateTaskDto, TaskDto, UpdateTaskDto} from "../types";

// we already added  prefix /api in axios config

const TASKS_BASE_PATH = "/tasks";
const PROJECTS_BASE_PATH = "/projects";
const COLLABORATORS_BASE_PATH = "/collaborators";

// export const fetchTasks = async () => {
//   const res = await axiosInstance.get(TASKS_BASE_PATH);
//   return res.data;
// };
export const fetchTasksByProjectId = async (id:string) => {
    const res = await axiosInstance.get(`${PROJECTS_BASE_PATH}/${id}/tasks`);
    return res.data;
};

export const fetchCreateTask = async (taskDto: CreateTaskDto) => {
    const res = await axiosInstance.post(TASKS_BASE_PATH, taskDto);
    return res.data;
};
export const fetchDeleteTask = async (id: string) => {
    await axiosInstance.delete(`/tasks/${id}`);
};

export const fetchAddExecutorToTask = async (collaboratorId: string, taskId: string): Promise<TaskDto> => {
    const response = await axiosInstance.post(`${COLLABORATORS_BASE_PATH}/${collaboratorId}/tasks/${taskId}`);
    return response.data;
};


export const fetchUpdateTask = async (id: string,taskDto: UpdateTaskDto) => {
    const res = await axiosInstance.patch(`${TASKS_BASE_PATH}/${id}`, taskDto);
    return res.data;
};
