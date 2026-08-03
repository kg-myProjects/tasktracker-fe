import {NavLink} from "react-router-dom";
import React from "react";

interface NavigationLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function NavigationLink({to, children, className = "", onClick,}: NavigationLinkProps) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `text-sm font-inter font-medium whitespace-nowrap transition-all duration-300 ease-in-out 
            ${isActive
                    ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,1)] text-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    : "text-white"
            }
                hover:text-cyan-400
                hover:scale-[1.1]
                hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)]
                hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)]
                ${className}
            `}
        >
            {children}
        </NavLink>
    );
}