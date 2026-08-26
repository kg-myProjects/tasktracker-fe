import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DndContext, type DragEndEvent, type DragOverEvent, DragOverlay} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {selectFilteredTasks, getTasksByProjectId, setSearchQuery, selectSearchQuery, toggleMarker, selectSelectedMarkerIds} from "../../tasks/slice/tasksSlice";
import {
    clearDeleteError,
    deleteProject,
    getProjectById,
    selectCurrentProject, selectDeleteProjectErrorMessage,
    selectInviteUserErrorMessage
} from "../slice/projectsSlice";
import {clearStatusError, createTaskStatus, getAllTaskStatuses, selectErrorMessage, selectIsLoading, selectSortedTaskStatuses} from "../../statuses/slice/taskStatusSlice";
import {SortableTask} from "./SortableTask.tsx";
import {BoardHeader} from "./BoardHeader.tsx";
import {BoardModals} from "./BoardModals.tsx";
import {useKanbanDnd} from "../hooks/useKanbanDnd";
import {useKanbanActions} from "../hooks/useKanbanActions";
import {usePageTitle} from "../../../app/customHooks/usePageTitle.ts";
import {SortableColumn} from "./SortableColumn.tsx";
import NotificationModal from "../../../components/ui/NotificationModal.tsx";
import {MobileColumnArrow} from "./MobileColumnArrow.tsx";
import {useIsMobile} from "../../../app/customHooks/useIsMobile.tsx";
import {TaskOverlayCard} from "./TaskOverlayCard.tsx";
import {ColumnOverlayCard} from "./ColumnOverlayCard.tsx";
import {DotsPagination} from "../../../components/ui/DotsPagination.tsx";
import ConfirmModal from "../../../components/ui/ConfirmModal.tsx";

export default function KanbanBoard() {

    const {projectId} = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const tasks = useAppSelector(selectFilteredTasks);
    const searchQuery = useAppSelector(selectSearchQuery);
    const project = useAppSelector(selectCurrentProject);
    const selectedMarkerIds = useAppSelector(selectSelectedMarkerIds);
    const statuses = useAppSelector(selectSortedTaskStatuses);
    const inviteError = useAppSelector(selectInviteUserErrorMessage);
    const isLoading = useAppSelector(selectIsLoading);
    const statusesError = useAppSelector(selectErrorMessage);
    const deleteError = useAppSelector(selectDeleteProjectErrorMessage);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentStatusId, setCurrentStatusId] = useState<string | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [statusToDelete, setStatusToDelete] = useState<{ id: string, name: string } | null>(null);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
    const [mobileStatusIndex, setMobileStatusIndex] = useState(0);

    usePageTitle(project ? `TrackerApp | ${project.title}` : "Loading...");
    const isMobile = useIsMobile(600);

    const {
        sensors, activeTask, activeStatus, handleDragStart, handleDragEnd: handleDragEndFromHook,
        collisionDetection, dropAnimation
    } = useKanbanDnd(tasks, statuses);

    const {
        handleCreateTask, handleDeleteStatus, handleInvite
    } = useKanbanActions(projectId);

    useEffect(() => {
        if (projectId) {
            dispatch(getProjectById(projectId));
            dispatch(getAllTaskStatuses(projectId));
            dispatch(getTasksByProjectId(projectId));
        }
    }, [projectId, dispatch]);

    const projectMarkers = project?.markers || [];
    const allNames = statuses.map(s => s.name);

    const tasksByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => ({
            ...acc,
            [status.id]: tasks.filter(t => t.statusId === status.id)
        }), {} as Record<string, typeof tasks>);
    }, [tasks, statuses]);

    const handleDragOver = ({over}: DragOverEvent) => {
        if (!over) return;

        const id = String(over.id);

        // Hovering a dragged task over an arrow on mobile —
        // just switch the visible column here; the actual drop is handled in handleDragEnd.
        if (id === "mobile-right") {
            setMobileStatusIndex(prev =>
                Math.min(prev + 1, statuses.length - 1)
            );
        }
        if (id === "mobile-left") {
            setMobileStatusIndex(prev =>
                Math.max(prev - 1, 0)
            );
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        // On mobile, after dropping, "catch up" the view to the column
        // the task actually landed in — otherwise the drop animation flies toward
        // a DOM node that doesn't exist (only one column is rendered at a time on mobile)
        if (isMobile) {
            const over = event.over;
            if (over) {
                const overId = String(over.id);
                const targetStatusId = statuses.some(s => s.id === overId)
                    ? overId
                    : tasks.find(t => t.id === overId)?.statusId;

                if (targetStatusId) {
                    const targetIndex = statuses.findIndex(s => s.id === targetStatusId);
                    if (targetIndex !== -1) {
                        setMobileStatusIndex(targetIndex);
                    }
                }
            }
        }
        handleDragEndFromHook(event);
    };

    if (isLoading && statuses.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-text-muted animate-pulse font-black uppercase tracking-widest">
                    Loading project column...
                </div>
            </div>
        );
    }

    return (
        <div className="flex px-2 py-4 flex-col bg-secondary-dark border border-dark-accent/30 rounded-2xl overflow-x-hidden min-w-0">
            <BoardHeader
                title={project?.title}
                searchQuery={searchQuery}
                onSearchChange={(val) => dispatch(setSearchQuery(val))}
                selectedMarkerIds={selectedMarkerIds}
                projectMarkers={projectMarkers}
                onMarkerToggle={(id) => dispatch(toggleMarker(id))}
                onAddStatus={() => setStatusModalOpen(true)}
                onAddCollab={() => setIsInviteModalOpen(true)}
                onOpenLogs={() => setIsLogsModalOpen(true)}
                collaborators={project?.projectTeam}
                onDeleteBoard={() => setProjectDeleteOpen(true)}
            />
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {statuses.length === 0 ? (
                    // Empty state — shared between mobile and desktop, so the arrows/pagination
                    // never render with zero columns (otherwise mobileStatusIndex could drift out of bounds)
                    <div className="flex items-center justify-center w-full py-12 text-text-muted text-sm">
                        Add your first task status to get started.
                    </div>
                ) : isMobile ? (
                    <> {/* MOBILE SCREEN BLOCK — only ONE column is rendered at a time (statuses[mobileStatusIndex]).
                           This is intentional: rendering all columns and just hiding them via CSS
                           causes dnd-kit to register duplicate ids and produces drag/drop collisions */}
                        <DotsPagination total={statuses.length} activeIndex={mobileStatusIndex}/>
                        <div className="flex justify-center gap-2 w-full min-w-0">
                            <MobileColumnArrow
                                direction="left"
                                disabled={mobileStatusIndex === 0}
                                onChangeColumn={() => setMobileStatusIndex(prev => prev - 1)}
                            />
                            {statuses[mobileStatusIndex] && (
                                <div className="flex-1 min-w-0">
                                    <SortableColumn
                                        dragDisabled={true} // Column reordering is disabled on mobile — nothing to reorder against, only one column is visible.
                                        status={statuses[mobileStatusIndex]}
                                        allStatusNames={allNames}
                                        onAddTask={() => {
                                            setCurrentStatusId(statuses[mobileStatusIndex].id);
                                            setModalOpen(true);
                                        }}
                                        canDelete={(tasksByStatus[statuses[mobileStatusIndex].id] || []).length === 0}
                                        onDelete={() =>
                                            setStatusToDelete({
                                                id: statuses[mobileStatusIndex].id,
                                                name: statuses[mobileStatusIndex].name
                                            })
                                        }
                                    >
                                        <SortableContext
                                            items={(tasksByStatus[statuses[mobileStatusIndex].id] || []).map(t => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="flex flex-col gap-2">
                                                {(tasksByStatus[statuses[mobileStatusIndex].id] || []).map(task => (
                                                    <SortableTask
                                                        key={task.id}
                                                        task={task}
                                                        onOpenEdit={() => setEditingTaskId(task.id)}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </SortableColumn>
                                </div>
                            )}
                            <MobileColumnArrow
                                direction="right"
                                disabled={mobileStatusIndex >= statuses.length - 1}
                                onChangeColumn={() => setMobileStatusIndex(prev => prev + 1)}
                            />
                        </div>
                    </>
                ) : (
                    // DESKTOP SCREEN BLOCK
                        <div className="flex gap-2 overflow-x-auto">
                            {statuses.map(status => {
                                const tasksInStatus = tasksByStatus[status.id] || [];
                                return (
                                    <SortableColumn
                                        key={status.id}
                                        status={status}
                                        allStatusNames={allNames}
                                        onAddTask={() => {
                                            setCurrentStatusId(status.id);
                                            setModalOpen(true);
                                        }}
                                        canDelete={tasksInStatus.length === 0}
                                        onDelete={() => setStatusToDelete({id: status.id, name: status.name})}
                                    >
                                        <SortableContext
                                            items={tasksInStatus.map(t => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="flex flex-col gap-2">
                                                {tasksInStatus.map(task => (
                                                    <SortableTask
                                                        key={task.id}
                                                        task={task}
                                                        onOpenEdit={() => setEditingTaskId(task.id)}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </SortableColumn>
                                );
                            })}
                        </div>
                )}
                <DragOverlay dropAnimation={dropAnimation} modifiers={[snapCenterToCursor]}>
                    {/* snapCenterToCursor pins the overlay to the pointer/finger every frame,
                        instead of relying on a one-time measured position — without it the overlay
                        would occasionally "fly off" on touch devices */}
                    {activeTask && <TaskOverlayCard task={activeTask}/>}
                    {activeStatus && (
                        <ColumnOverlayCard
                            status={activeStatus}
                            tasks={tasksByStatus[activeStatus.id] || []}
                        />
                    )}
                </DragOverlay>
            </DndContext>
            <BoardModals
                modals={{
                    task: {
                        isOpen: modalOpen,
                        statusId: currentStatusId,
                        statusName: statuses.find(s => s.id === currentStatusId)?.name || "",
                        onClose: () => setModalOpen(false)
                    },
                    status: {
                        isOpen: statusModalOpen,
                        onClose: () => setStatusModalOpen(false),
                        maxPosition: statuses.length
                    },
                    invite: {
                        isOpen: isInviteModalOpen,
                        onClose: () => setIsInviteModalOpen(false),
                        error: inviteError
                    },
                    edit: {
                        taskId: editingTaskId,
                        task: tasks.find(t => t.id === editingTaskId),
                        onClose: () => setEditingTaskId(null)
                    },
                    deleteStatus: {
                        status: statusToDelete,
                        onClose: () => setStatusToDelete(null)
                    },
                    logs: {
                        isOpen: isLogsModalOpen,
                        onClose: () => setIsLogsModalOpen(false),
                        projectId: projectId!
                    }
                }}
                actions={{
                    onCreateTask: async (title, desc) => {
                        await handleCreateTask(title, desc, currentStatusId!);
                        setModalOpen(false);
                    },
                    onCreateStatus: async (name, pos) => {
                        try {
                            await dispatch(createTaskStatus({name, position: pos, projectId: projectId!})).unwrap();
                            setStatusModalOpen(false);
                        } catch (error) {
                            console.error("Status creation failed:", error);
                        }
                    },
                    onInvite: (email, role) => {
                        handleInvite(projectId!, email, role).then(res => {
                            if (res.meta.requestStatus === 'fulfilled') setIsInviteModalOpen(false);
                        });
                    },
                    onDeleteStatus: handleDeleteStatus
                }}
            />
            {statusesError && (
                <NotificationModal
                    title="Access Denied"
                    message={statusesError}
                    onClose={() => dispatch(clearStatusError())}
                />
            )}
            {projectDeleteOpen && (
                <ConfirmModal
                    title="Delete board?"
                    message={`Are you sure you want to delete "${project?.title}"? All tasks and data will be permanently removed.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={async () => {
                        if (!projectId) return;

                        try {
                            await dispatch(deleteProject(projectId)).unwrap();
                            navigate("/projects");
                        } catch {
                            setProjectDeleteOpen(false);
                        }
                    }}
                    onCancel={() => setProjectDeleteOpen(false)}
                />
            )}
            {deleteError && (
                <NotificationModal
                    title="ACCESS DENIED"
                    message={deleteError}
                    variant="error"
                    onClose={() => {
                        dispatch(clearDeleteError());
                        setProjectDeleteOpen(false);
                    }}
                />
            )}
        </div>
    );
}