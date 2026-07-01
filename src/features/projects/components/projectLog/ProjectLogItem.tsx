import {getLogMessage} from "./projectLogFormatter.tsx";
import type {ProjectLog} from "../../types";
import {API_URL} from "../../../../config/api.ts";


interface ProjectLogsItemProps {
    log: ProjectLog;
}

const ProjectLogItem = ({log}: ProjectLogsItemProps) => {
    return (
        <div className="bg-slate-800 rounded-md p-1 flex justify-between items-center gap-4 text-sm text-white hover:bg-slate-600/60 transition-colors">
            <div className="flex items-center gap-2">
                {log.userAvatar ? (
                    <img
                        src={`${API_URL}${log.userAvatar}`}
                        alt="avatar"
                        className="h-7 w-7 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-cyan-400 flex items-center justify-center text-white font-semibold">
                        {log.userEmail.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="font-medium text-[10px] md:text-sm">
                    {getLogMessage(
                        log.action,
                        log.entity,
                        log.entityName,
                        log.userEmail,
                        log.userFirstName,
                        log.userLastName,
                        log.difference
                    )}
                </span>
            </div>
                <div className="flex flex-col items-end text-xs text-cyan-500 whitespace-nowrap">
                    <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
        </div>
    );
};

export default ProjectLogItem;