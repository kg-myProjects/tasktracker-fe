import type {ProjectLogAction} from "../../types";

export const getLogMessage = (
    action: ProjectLogAction,
    entity: "Task" | "Status",
    entityName: string,
    userEmail: string,
    userFirstName: string | null,
    userLastName: string | null,
    difference?: string
) => {
    const fullName = [userFirstName, userLastName].filter(Boolean).join(" ");
    const displayUser = fullName ? `${fullName} (${userEmail})` : userEmail;

    let verb = "";
    let restText = "";
    let verbColor = "text-white";

    switch (action) {
        case "CREATE":
            verb = "CREATED";
            verbColor = "text-green-500";
            restText = ` ${entity.toLowerCase()}: ${entityName} ${formatCreateDeleteDiff(difference)}`;
            break;

        case "DELETE":
            verb = "DELETED";
            verbColor = "text-red-500";
            restText = ` ${entity.toLowerCase()}: ${entityName} ${formatCreateDeleteDiff(difference)}`;
            break;

        case "MOVE":
            verb = "MOVED";
            verbColor = "text-purple-500";
            restText = ` ${entity.toLowerCase()}: ${entityName}. ${formatMoveDiff(difference)}.`;
            break;

        case "MARKERS":
            if (difference?.startsWith("markerAdded=")) {
                verb = "ADDED";
                verbColor = "text-green-500";
            } else if (difference?.startsWith("markerRemoved=")) {
                verb = "REMOVED";
                verbColor = "text-red-500";
            }
            restText = ` marker: ${difference?.replace(/markerAdded=|markerRemoved=/, "")} on ${entity.toLowerCase()}: ${entityName}.`;
            break;

        case "TITLE":
            verb = "CHANGED";
            verbColor = "text-yellow-400";
            restText = ` title on ${entity.toLowerCase()}: ${formatTitleDiff(difference)}.`;
            break;

        case "DESCRIPTION":
            verb = "CHANGED";
            verbColor = "text-yellow-400";
            restText = ` description on ${entity.toLowerCase()}: ${entityName}. ${formatDescriptionDiff(difference)}.`;
            break;

        case "DUE_DATE":
            return (
                <>
                    <span className="font-medium">{displayUser}</span>{" "}
                    {formatDueDateDiff(difference, entity, entityName)}
                </>
            );

        default:
            verb = action;
            restText = "";
    }

    return (
        <>
            <span className="font-medium">{displayUser}</span>{" "}
            <span className={`${verbColor} font-semibold`}>{verb}</span>
            <span className="text-cyan-400">{restText}</span>
        </>
    );
};

function formatDate(iso: string) {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatMoveDiff(diff?: string) {
    if (!diff) return "";
    const from = diff.match(/fromStatus=([^,]+)/)?.[1] ?? "";
    const to = diff.match(/toStatus=(.+)/)?.[1] ?? "";
    return `From: ${from} to: ${to}`;
}

function formatTitleDiff(diff?: string) {
    if (!diff) return "";
    const oldTitle = diff.match(/oldTitle=([^,]+)/)?.[1] ?? "";
    const newTitle = diff.match(/newTitle=([^,]+)/)?.[1] ?? "";
    return `${oldTitle}. From: "${oldTitle}" to: "${newTitle}"`;
}

function formatDescriptionDiff(diff?: string) {
    if (!diff) return "";
    const oldDesc = diff.match(/oldDescription=([^,]+)/)?.[1] ?? "";
    const newDesc = diff.match(/newDescription=([^,]+)/)?.[1] ?? "";
    return `From "${oldDesc}" to "${newDesc}"`;
}

function formatDueDateDiff(diff?: string, entity?: string, entityName?: string) {
    if (!diff) return null;

    if (diff.startsWith("dueDateAdded=")) {
        const dateStr = diff.replace("dueDateAdded=", "");
        return (
            <>
                <span className="text-green-500 font-semibold uppercase">set</span>
                <span className="text-cyan-300">
                    {" "}deadline on {entity?.toLowerCase()}: {entityName} to: {formatDate(dateStr)}.
                </span>
            </>
        );
    }

    if (diff.startsWith("dueDateRemoved=")) {
        const dateStr = diff.replace("dueDateRemoved=", "");
        return (
            <>
                <span className="text-red-500 font-semibold uppercase">removed</span>
                <span className="text-cyan-300">
                    {" "}deadline on {entity?.toLowerCase()}: {entityName}. (Deadline was: {formatDate(dateStr)}).
                </span>
            </>
        );
    }

    if (diff.startsWith("dueDateChanged=")) {
        const [from, to] = diff.replace("dueDateChanged=", "").split("->");
        return (
            <>
                <span className="text-yellow-400 font-semibold uppercase">changed</span>
                <span className="text-cyan-300">
                    {" "}deadline on {entity?.toLowerCase()}: {entityName}. From: {formatDate(from)} to: {formatDate(to)}.
                </span>
            </>
        );
    }

    return <span className="text-cyan-300">{diff}</span>;
}

function formatCreateDeleteDiff(diff?: string) {
    if (!diff) return "";

    if (diff.startsWith("createdIn=") || diff.startsWith("deletedFrom=")) {
        const status = diff.split("=")[1];
        return `in status: ${status}.`;
    }

    return "";
}