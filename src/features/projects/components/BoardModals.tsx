import {TaskModal} from "./TaskModal.tsx";
import {CreateStatusModal} from "./CreateStatusModal";
import {InviteModal} from "./InviteModal.tsx";
import {EditTaskModal} from "../../tasks/components/EditTaskModal";
import type {ProjectRole} from "../types";
import type {Task} from "../../tasks/types";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import {ProjectLogModal} from "./projectLog/ProjectLogModal.tsx";

import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectCreateTaskErrorMessage, clearTaskError } from "../../tasks/slice/tasksSlice";
import NotificationModal from "../../../components/ui/NotificationModal";

interface BoardModalsProps {
    modals: {
        task: {
            isOpen: boolean;
            statusId: string | null;
            statusName: string;
            onClose: () => void
        };
        status: {
            isOpen: boolean;
            onClose: () => void;
            maxPosition: number
        };
        invite: {
            isOpen: boolean;
            onClose: () => void;
            error?: string
        };
        edit: {
            taskId: string | null;
            task: Task | undefined;
            onClose: () => void
        };
        deleteStatus: {
            status: { id: string; name: string } | null;
            onClose: () => void;
        };
        logs?: {
            isOpen: boolean;
            onClose: () => void;
            projectId: string };
    };
    actions: {
        onCreateTask: (title: string, description: string) => void;
        onCreateStatus: (name: string, position: number) => void;
        onInvite: (email: string, role: ProjectRole) => void;
        onDeleteStatus: (id: string, name: string) => void;
    };

}

export const BoardModals = ({modals, actions}: BoardModalsProps) => {
    const dispatch = useAppDispatch();
    const taskErrorMessage = useAppSelector(selectCreateTaskErrorMessage);

    return (
        <>
            {taskErrorMessage && (
                <NotificationModal
                    title="ACCESS DENIED"
                    message={taskErrorMessage}
                    buttonText="Cancel"
                    variant="error"
                    onClose={() => dispatch(clearTaskError())} // Очищуємо помилку в Redux
                />
            )}
            {/* New Task */}
            <TaskModal
                isOpen={modals.task.isOpen}
                onClose={modals.task.onClose}
                onCreate={actions.onCreateTask}
                statusName={modals.task.statusName}
            />

            {/* New Status */}
            <CreateStatusModal
                isOpen={modals.status.isOpen}
                onClose={modals.status.onClose}
                onCreate={actions.onCreateStatus}
                maxPosition={modals.status.maxPosition}
            />

            {/* Invite Collaborators */}
            <InviteModal
                isOpen={modals.invite.isOpen}
                onClose={modals.invite.onClose}
                onInvite={actions.onInvite}
                error={modals.invite.error}
            />

            {/* Edit Task */}
            {modals.edit.task && (
                <EditTaskModal
                    card={modals.edit.task}
                    onClose={modals.edit.onClose}
                />
            )}
            {modals.deleteStatus.status && (
                <ConfirmModal
                    title="Delete column?"
                    message={`Are you sure you want to delete the column "${modals.deleteStatus.status.name}"? All data in this column will be erased.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={() => {
                        if (modals.deleteStatus.status) {
                            actions.onDeleteStatus(modals.deleteStatus.status.id, modals.deleteStatus.status.name);
                            modals.deleteStatus.onClose();
                        }
                    }}
                    onCancel={modals.deleteStatus.onClose}
                />
            )}

            {modals.logs && modals.logs.isOpen && (
                <ProjectLogModal
                    isOpen={modals.logs.isOpen}
                    projectId={modals.logs.projectId}
                    onClose={modals.logs.onClose}
                />
            )}
        </>
    );
};
