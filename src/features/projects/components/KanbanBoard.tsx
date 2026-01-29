import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../../tasks/types";
import {Column} from "./Column.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getTasksByProjectId, updateTask, createTask, selectTasks } from "../../tasks/slice/tasksSlice";
import {getProjectById, inviteUser, selectCurrentProject, selectInviteUserErrorMessage} from "../slice/projectsSlice";
import {DragOverlay, defaultDropAnimationSideEffects, type DragStartEvent} from "@dnd-kit/core";
import {
    getAllTaskStatuses,
    selectSortedTaskStatuses,
    createTaskStatus, deleteTaskStatus,

} from "../../statuses/slice/taskStatusSlice";
import { CreateStatusModal } from "./CreateStatusModal";
import {TaskModal} from "./TaskModal.tsx";
import {EditTaskModal} from "../../tasks/components/EditTaskModal";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext,closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {SortableTask} from "./SortableTask.tsx";
import {InviteModal} from "./InviteModal.tsx";
import type {ProjectRole} from "../types";
import {CollaboratorsList} from "./CollaboratorsList.tsx";

const pointerSensorOptions = {
    activationConstraint: { distance: 8 },
};


export default function KanbanBoard() {


    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();


    const tasks = useAppSelector(selectTasks);
    const project = useAppSelector(selectCurrentProject);
    const statuses = useAppSelector(selectSortedTaskStatuses);
    const inviteError = useAppSelector(selectInviteUserErrorMessage);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentStatusId, setCurrentStatusId] = useState<string | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);


    useEffect(() => {
        if (!projectId) return;
        dispatch(getProjectById(projectId));
        dispatch(getAllTaskStatuses(projectId));
        dispatch(getTasksByProjectId(projectId));

    }, [projectId, dispatch]);


    const tasksByStatus = useMemo(() => {
        return statuses.reduce<Record<string, Task[]>>((acc, status) => {
            acc[status.id] = tasks.filter(task => task.statusId === status.id);
            return acc;
        }, {});
    }, [tasks, statuses]);

    const taskToEdit = useMemo(() =>
            tasks.find(t => t.id === editingTaskId),
        [tasks, editingTaskId]
    );

    // const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const sensors = useSensors(useSensor(PointerSensor, pointerSensorOptions));

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
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

        if (task.statusId === newStatusId) return;

        dispatch(updateTask({ id: activeId, dto: { statusId: newStatusId } }));
    };

    const openModal = (statusId: string) => {
        setCurrentStatusId(statusId);
        setModalOpen(true);
    };

    const handleCreateTask = (title: string, description: string) => {
        if (!projectId || !currentStatusId) return;

        dispatch(createTask({
            title,
            description,
            statusId: currentStatusId,
            projectId
        }));
        setModalOpen(false);
    };

    const handleCreateStatus = async (name: string, position: number) => {
        if (!projectId) return;

        try {

            await dispatch(createTaskStatus({
                name,
                projectId,
                position,
            })).unwrap();


            await dispatch(getAllTaskStatuses(projectId));

            setStatusModalOpen(false);
        } catch (err) {
            console.error("Ошибка при создании статуса:", err);
        }
    };


    const handleInviteSubmit = async (email: string, role: ProjectRole) => {
        if (project?.id) {
            const result = await dispatch(inviteUser({
                id: project.id,
                dto: { email, role}
            }));

            if (inviteUser.fulfilled.match(result)) {
                setIsInviteModalOpen(false);
            }
        }
    };



    return (
        <div className="h-screen flex flex-col bg-slate-900 rounded-2xl border border-cyan-400/30 p-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="flex items-center gap-4 mb-4 text-neon-strong">
                <h1 className="text-2xl font-bold">
                    {project?.title ?? "Loading..."}
                </h1>

                <button
                    onClick={() => setStatusModalOpen(true)}
                    className="p-6 mt-10 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all  font-bold"
                >
                    + Add Status
                </button>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="p-6 mt-10 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all  font-bold"
                >
                    + Add collaborators
                </button>

                {project && (
                    <CollaboratorsList
                        collaborators={project.projectTeam}
                        onInviteClick={() => setIsInviteModalOpen(true)}
                    />
                )}

            </div>
            <DndContext sensors={sensors}
                        onDragStart={handleDragStart}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                    {statuses.map(status => {
                        const tasksInStatus = tasksByStatus[status.id] ?? [];
                        const canDelete = tasksInStatus.length === 0;

                        const handleDeleteStatus = async () => {
                            if (!projectId) return;
                            if (window.confirm(`Delete column "${status.name}"?`)) {
                                try {
                                    await dispatch(deleteTaskStatus(status.id)).unwrap();
                                    await  dispatch(getAllTaskStatuses(projectId!));
                                } catch (error) {
                                    console.error("Delete status failed:", error);
                                    alert("Could not delete column. Maybe it still has tasks?");
                                }
                            }                        };

                        return (
                            <Column
                                key={status.id}
                                status={status}
                                onAddTask={() => openModal(status.id)}
                                canDelete={canDelete}
                                onDelete={handleDeleteStatus}
                            >
                                <SortableContext
                                    items={tasksByStatus[status.id]?.map(t => t.id) ?? []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex flex-col gap-2">
                                        {/*{tasksByStatus[status.id]?.map(task => (*/}
                                        { tasksInStatus.map(task => (

                                            <SortableTask key={task.id} task={task} onOpenEdit={()=> setEditingTaskId(task.id) }/>
                                        ))}
                                    </div>
                                </SortableContext>
                            </Column>
                        );
                    })}
                </div>
                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: { active: { opacity: '0.5' } },
                    }),
                }}>
                    {activeTask ? (
                        // Рендерим простую версию карточки без хуков dnd
                        <div className="bg-white rounded-xl p-3 border-2 border-cyan-500 shadow-2xl rotate-3 cursor-grabbing w-[300px]">
                            <div className="font-semibold text-black">{activeTask.title}</div>
                            <div className="text-sm text-slate-600 mt-1 line-clamp-2">{activeTask.description}</div>
                        </div>
                    ) : null}
                </DragOverlay>

            </DndContext>

            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreateTask}
                statusName={statuses.find(s => s.id === currentStatusId)?.name ?? ""}
            />
            <CreateStatusModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onCreate={handleCreateStatus}
                maxPosition={statuses.length}
            />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInviteSubmit}
                error={inviteError}
            />

            {taskToEdit && (
                <EditTaskModal
                    card={taskToEdit}
                    onClose={() => setEditingTaskId(null)}
                />
            )}


        </div>
    );
}
