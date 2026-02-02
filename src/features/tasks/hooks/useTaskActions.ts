import {useAppDispatch} from "../../../app/hooks.ts";
import type {ChecklistItem, Task, UpdateTaskDto } from "../types";
import {updateTask} from "../slice/tasksSlice.ts";
import {addMarkerToCurrentProject} from "../../projects/slice/projectsSlice.ts";
import {fetchCreateMarker} from "../services/api.ts";

export const useTaskActions = (currentTask: Task, projectId?: string) => {
    const dispatch = useAppDispatch();

    const patchTask = (dto: UpdateTaskDto) => {
        dispatch(updateTask({id: currentTask.id, dto}));
    };
    const handleAddExecutor = (collaboratorId: string) => {
        const currentIds = currentTask.executors?.map(ex => ex.id) || [];
        const newIds = currentIds.includes(collaboratorId)
            ? currentIds.filter(id => id !== collaboratorId)
            : [...currentIds, collaboratorId];

        patchTask({ executorIds: newIds });
    };

    const handleAddMarker = (markerId: string) => {
        const currentIds = currentTask.markers?.map(m => m.id) || [];
        const newIds = currentIds.includes(markerId)
            ? currentIds.filter(id => id !== markerId)
            : [...currentIds, markerId];

        patchTask({ markerIds: newIds });
    };

    const handleCreateAndAddMarker = async (name: string, color: string) => {
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
        patchTask
    };

}