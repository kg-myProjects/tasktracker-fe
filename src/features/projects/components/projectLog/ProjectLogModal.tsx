import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks.ts";
import {selectCurrentProjectLogs, getProjectLogs} from "../../slice/projectsSlice.ts";
import ProjectLogItem from "./ProjectLogItem.tsx";
import PulsedStripe from "../../../../components/ui/effects/PulsedStripe.tsx";

interface ProjectLogsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const LOGS_PER_PAGE = 15;

export const ProjectLogModal: React.FC<ProjectLogsModalProps> = ({isOpen, onClose, projectId}) => {
    const dispatch = useAppDispatch();
    const logs = useAppSelector(selectCurrentProjectLogs);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (isOpen) {
            dispatch(getProjectLogs(projectId));
            setCurrentPage(1);
        }
    }, [isOpen, projectId, dispatch]);

    if (!isOpen) return null;

    const totalPages = Math.ceil(logs.length / LOGS_PER_PAGE);
    const currentLogs = logs.slice((currentPage - 1) * LOGS_PER_PAGE, currentPage * LOGS_PER_PAGE);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
             onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-5xl rounded-xl shadow-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/40"
                onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="relative w-full">
                    <div className="absolute w-full h-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900"></div>
                    <div className="flex relative h-20 items-center justify-center">
                        <h2 className="text-xl font-bold text-white text-neon-strong uppercase">Board Logs</h2>
                    </div>
                    <PulsedStripe height="2px" />
                </div>
                {/* LOGS */}
                <div className="h-[50vh] overflow-y-auto px-2 py-2 space-y-2">
                    {logs.length === 0 ? (
                        <div className="text-cyan-500 text-sm">No logs yet</div>
                    ) : (
                        currentLogs.map((log, index) => (
                            <ProjectLogItem key={`${log.createdAt}-${index}`} log={log}/>
                        ))
                    )}
                </div>
                {/* FOOTER */}
                {totalPages > 1 && (
                    <div className="flex px-6 py-4 items-center border-t border-cyan-500/20 hover:border-cyan-500/40 justify-center gap-2">
                        {/* BACK BUTTON */}
                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
                        >
                            <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {/* PAGES */}
                        <span className="text-cyan-400">{currentPage} from {totalPages}</span>
                        {/* FORWARD BUTTON */}
                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
                        >
                            <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
