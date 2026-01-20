import type { Task } from "../../tasks/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableTask({ task }: { task: Task }) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: task.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}
             className="bg-white rounded p-3 shadow-sm cursor-grab">
            <div className="font-semibold text-black">{task.title}</div>
            <div className="text-sm text-slate-600 text-black">{task.description}</div>
        </div>
    );
}

