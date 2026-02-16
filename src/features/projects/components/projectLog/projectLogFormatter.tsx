export const getLogMessage = (
    action: "CREATE" | "DELETE",
    entity: "Task" | "Status",
    entityName: string,
    userEmail: string
) => {
    const verb = action === "CREATE" ? "created" : "deleted";
    const verbColor = action === "CREATE" ? "text-green-500" : "text-red-500";
    const entityLabel = entity === "Task" ? "the task" : "the status";

    return (
        <>
            <span>{userEmail}</span>
            {" "}
            <span className={`${verbColor} font-semibold`}>{verb}</span>
            {" "}
            {entityLabel} "{entityName}"
        </>
    );
}