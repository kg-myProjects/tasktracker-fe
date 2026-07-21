import type {ReactNode} from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Column} from "./Column";
import type {TaskStatus} from "../../statuses/types";

export interface SortableColumnProps {
    status: TaskStatus;
    allStatusNames: string[];
    children: ReactNode;
    onAddTask: () => void;
    onDelete?: () => void;
    canDelete?: boolean;
    dragDisabled?: boolean;
}

export function SortableColumn(props: SortableColumnProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: props.status.id,
        data: {type: "Status"},
        disabled: props.dragDisabled
    });

    const style = {transform: CSS.Translate.toString(transform), transition,};

    const dragProps = props.dragDisabled ? {} : { ...attributes, ...listeners };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? "opacity-30" : "opacity-100"} transition-opacity`}
        >
            <div {...dragProps}>
                <Column {...props} />
            </div>
        </div>
    );
}