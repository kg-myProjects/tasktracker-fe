import {useDroppable} from "@dnd-kit/core";
import {ArrowIcon} from "../../../components/ui/icons/ArrowIcon.tsx";
import {useRef, useState} from "react";

interface MobileColumnArrowProps {
    direction: "left" | "right";
    disabled: boolean;
    onChangeColumn: () => void;
}

export function MobileColumnArrow({
                                      direction,
                                      disabled,
                                      onChangeColumn
                                  }: MobileColumnArrowProps) {

    const timeoutRef = useRef<number | null>(null);
    const [isPressed, setIsPressed] = useState(false);
    const {setNodeRef, isOver} = useDroppable({id: `mobile-${direction}`});

    const handleClick = () => {
        setIsPressed(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsPressed(false), 150);
        onChangeColumn();
    };

    let bgClass = "bg-surface-dark text-accent hover:bg-dark-accent";
    if (isPressed) bgClass = "bg-slate-600 text-cyan-300";
    if (isOver) bgClass = "bg-cyan-500 text-black scale-110";

    return (
        <button
            ref={setNodeRef}
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className={`
                w-[28px] py-2
                flex flex-col justify-between items-center
                shrink-0
                rounded-xl shadow-md
                cursor-pointer
                transition-all duration-150
                disabled:opacity-40
                disabled:cursor-not-allowed
                ${bgClass}
            `}
        >
            <ArrowIcon direction={direction} />
            <ArrowIcon direction={direction} />
        </button>
    );
}