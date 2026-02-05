import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentProjectLogs, getProjectLogs } from "../slice/projectsSlice";

interface ProjectLogsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const ProjectLogsModal: React.FC<ProjectLogsModalProps> = ({ isOpen, onClose, projectId }) => {
    const dispatch = useAppDispatch();
    const logs = useAppSelector(selectCurrentProjectLogs);

    useEffect(() => {
        if (isOpen) {
            dispatch(getProjectLogs(projectId));
        }
    }, [isOpen, projectId, dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-800 w-full max-w-3xl rounded-xl shadow-xl overflow-hidden">

                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                    <h2 className="text-lg font-bold text-white">Project Logs</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white font-bold px-2 py-1"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-2">
                    {logs.length === 0 ? (
                        <div className="text-slate-400 text-sm">No logs yet.</div>
                    ) : (
                        logs.map((log, index) => (
                            <div
                                key={index}
                                className="bg-slate-700/50 rounded-md p-3 flex flex-col gap-1 text-sm text-white"
                            >
                                <div>
                                    <span className="font-semibold">{log.entity}</span> - {log.entityName}
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>{log.action}</span>
                                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {log.userAvatar && (
                                        <img
                                            src={`http://localhost:8080${log.userAvatar}`}
                                            alt="avatar"
                                            className="h-5 w-5 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-300">{log.userEmail}</span>
                                        <span className="font-semibold text-white">
                                            {log.userNickname ? `aka ${log.userNickname}` : ""}
                                        </span>
                                    </div>
                                </div>
                                {log.difference && (
                                    <div className="text-xs text-cyan-400 mt-1">{log.difference}</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
