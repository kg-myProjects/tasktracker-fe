import { useSortable } from "@dnd-kit/sortable";
import type { ReactNode } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { Column } from "./Column";
import type { TaskStatus } from "../../statuses/types";

export interface SortableColumnProps {
    status: TaskStatus;
    allStatusNames: string[];
    children: ReactNode;
    onAddTask: () => void;
    onDelete?: () => void;
    canDelete?: boolean;
}

export function SortableColumn(props: SortableColumnProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props.status.id,
        data: {
            type: "Status",
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? "opacity-30" : "opacity-100"} transition-opacity`}
        >
            {/* listeners та attributes  */}
            <div {...attributes} {...listeners}>
                <Column {...props} />
            </div>
        </div>
    );
}
