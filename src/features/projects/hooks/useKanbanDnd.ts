import { useState } from "react";
import {useSensor, useSensors,
    PointerSensor, closestCorners, defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import type {DragStartEvent, DragEndEvent}from "@dnd-kit/core";
import { useAppDispatch } from "../../../app/hooks";
import { updateTask } from "../../tasks/slice/tasksSlice";
import type { Task } from "../../tasks/types";
import type { TaskStatus } from "../../statuses/types";

export const useKanbanDnd = (tasks: Task[], statuses: TaskStatus[]) => {
    const dispatch = useAppDispatch();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);
        const task = tasks.find(t => t.id === activeId);

        if (!task) return;

        let newStatusId: string;
        if (statuses.some(s => s.id === overId)) {
            newStatusId = overId;
        } else {
            const overTask = tasks.find(t => t.id === overId);
            newStatusId = overTask ? overTask.statusId : task.statusId;
        }

        if (task.statusId !== newStatusId) {
            dispatch(updateTask({ id: activeId, dto: { statusId: newStatusId } }));
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    return {
        sensors,
        activeTask,
        handleDragStart,
        handleDragEnd,
        collisionDetection: closestCorners,
        dropAnimation
    };
};
