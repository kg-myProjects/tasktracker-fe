export const getLogMessage = (
    action: "CREATE" | "DELETE",
    entity: "Task" | "Status",
    entityName: string,
    userEmail: string,
    userFirstName?: string,
    userLastName?: string
) => {
    const verb = action === "CREATE" ? "created" : "deleted";
    const verbColor = action === "CREATE" ? "text-green-500" : "text-red-500";
    const entityLabel = entity === "Task" ? "the task" : "the status";
    const fullName = [userFirstName, userLastName]
        .filter(Boolean)
        .join(" ");
    const displayUser = fullName
        ? `${fullName} (${userEmail})`
        : userEmail;

    return (
        <>
            <span>{displayUser}</span>{" "}
            <span className={`${verbColor} font-semibold`}>
                {verb}
            </span>{" "}
            {entityLabel} "{entityName}"
        </>
    );
}