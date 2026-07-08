import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks.ts";
import {selectCurrentProjectLogs, getProjectLogs} from "../../slice/projectsSlice.ts";
import ProjectLogItem from "./ProjectLogItem.tsx";
import PulsedStripe from "../../../../components/ui/effects/PulsedStripe.tsx";
import Pagination from "../../../../components/ui/Pagination.tsx";

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
            <div
                className="bg-slate-900 w-full max-w-5xl rounded-xl shadow-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/40"
                onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="relative w-full">
                    <div
                        className="absolute w-full h-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900"></div>
                    <div className="flex relative h-20 items-center justify-center">
                        <h2 className="text-xl font-bold text-white text-neon-strong uppercase">Board Logs</h2>
                    </div>
                    <PulsedStripe height="2px"/>
                </div>
                {/* LOGS */}
                <div className="h-[45vh] overflow-y-auto px-2 py-2 space-y-2">
                    {logs.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-cyan-500 text-sm">No logs yet</div>
                    ) : (
                        currentLogs.map((log) => (
                            <ProjectLogItem key={log.id} log={log}/>
                        ))
                    )}
                </div>
                {/* FOOTER */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};
