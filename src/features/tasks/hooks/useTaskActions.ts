import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import type {ChecklistItem, Task, UpdateTaskDto} from "../types";
import {updateTask} from "../slice/tasksSlice.ts";
import {addMarkerToCurrentProject} from "../../projects/slice/projectsSlice.ts";
import {fetchCreateMarker} from "../services/api.ts";

export const useTaskActions = (currentTask: Task | undefined, projectId?: string) => {
    const dispatch = useAppDispatch();

    const isUpdating = useAppSelector(state => state.tasks.isLoading);

    const patchTask = (fields: Partial<UpdateTaskDto>) => {
        if (!currentTask) return;
        dispatch(updateTask({ id: currentTask.id, dto: fields as UpdateTaskDto }));
    };

    const setDueDate = (date: string | null) => {
        patchTask({ dueDate: date });
    };

    const handleAddExecutor = (collaboratorId: string) => {
        if (!currentTask) return;
        const currentIds = currentTask.executors?.map(ex => ex.id) || [];
        const newIds = currentIds.includes(collaboratorId)
            ? currentIds.filter(id => id !== collaboratorId)
            : [...currentIds, collaboratorId];
        patchTask({ executorIds: newIds });
    };

    const handleAddMarker = (markerId: string) => {
        if (!currentTask) return;
        const currentIds = currentTask.markers?.map(m => m.id) || [];
        const newIds = currentIds.includes(markerId)
            ? currentIds.filter(id => id !== markerId)
            : [...currentIds, markerId];

        patchTask({ markerIds: newIds });
    };

    const handleCreateAndAddMarker = async (name: string, color: string) => {
        if (!currentTask) return;
        if (!name.trim() || !projectId) return;

        try {
            const newMarker = await fetchCreateMarker({
                name,
                color,
                projectId: projectId // Використовуємо projectId з аргументів хука
            });

            dispatch(addMarkerToCurrentProject(newMarker));
            const currentMarkerIds = currentTask.markers?.map(m => m.id) || [];

            patchTask({ markerIds: [...currentMarkerIds, newMarker.id] });
        } catch (error) {
            console.error("Marker creation failed:", error);
        }
    };

    const syncChecklist = (newItems: ChecklistItem[]) => {
        patchTask({ checklist: newItems });
    };

    return {
        handleAddExecutor,
        handleAddMarker,
        handleCreateAndAddMarker,
        syncChecklist,
        patchTask,
        isUpdating,
        setDueDate,
    };

}