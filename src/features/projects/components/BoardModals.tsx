import { TaskModal } from "./TaskModal.tsx";
import { CreateStatusModal } from "./CreateStatusModal";
import { InviteModal } from "./InviteModal.tsx";
import { EditTaskModal } from "../../tasks/components/EditTaskModal";
import type {ProjectRole } from "../types";
import type { Task} from "../../tasks/types";

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
    };
    actions: {
        onCreateTask: (title: string, description: string) => void;
        onCreateStatus: (name: string, position: number) => void;
        onInvite: (email: string, role: ProjectRole) => void;
    };
}

export const BoardModals = ({ modals, actions }: BoardModalsProps) => {
    return (
        <>
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
        </>
    );
};
