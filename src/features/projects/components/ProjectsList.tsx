import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {
    getMyProjects,
    selectProjects,
    updateProject,
    selectUpdateProjectErrorMessage,
    selectIsUpdatingProject,
} from "../slice/projectsSlice";
import NeonButton from "../../../components/ui/buttons/NeonButton.tsx";
import ProjectEditModal from "./ProjectEditModal.tsx";
import type {EditableProject, UpdateProjectDto} from "../types";
import MainButton from "../../../components/ui/buttons/MainButton.tsx";
import ProjectForm from "./ProjectForm.tsx";

export default function ProjectsList() {

    const dispatch = useAppDispatch();

    const projects = useAppSelector(selectProjects);
    const isUpdating = useAppSelector(selectIsUpdatingProject);
    const updateError = useAppSelector(selectUpdateProjectErrorMessage);

    const [projectToEdit, setProjectToEdit] = useState<EditableProject | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getMyProjects());
    }, [dispatch]);

    const handleOpenCreate = () => setShowForm(true);

    const handleCloseCreate = () => setShowForm(false);

    const handleOpenEdit = (project: EditableProject) => {
        setProjectToEdit(project);
    };

    const handleCloseEdit = () => setProjectToEdit(null);

    const handleUpdate = (values: UpdateProjectDto) => {
        if (!projectToEdit) return;
        dispatch(
            updateProject({
                id: projectToEdit.id,
                dto: values,
            }))
            .unwrap()
            .then(() => setProjectToEdit(null));
    };

    return (
        <section className="flex-1 p-4 md:p-8 min-h-screen border border-cyan-900/50 rounded-2xl bg-transparent">
            <div className="flex justify-between mb-10">
                <h2 className="text-cyan-400 text-xl md:text-3xl font-black uppercase tracking-[0.2em] text-glow">
                    My boards
                </h2>
                <MainButton size="compact" onClick={handleOpenCreate}>
                    New Board
                </MainButton>
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 bg-transparent">
                {projects?.map((project) => (
                    <div key={project.id}
                        className="relative flex flex-col bg-black/60 border border-cyan-900/50 rounded-2xl p-6 transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    >
                        <Link to={`/project/${project.id}`} className="absolute inset-0 z-10"
                              aria-label={`Open ${project.title}`}/>
                        <div className="relative z-0 flex-1">
                            <h3 className="text-cyan-400 text-xl font-black uppercase mb-2 group-hover:text-cyan-200 transition-colors line-clamp-2">
                                {project.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <NeonButton
                                size="sm"
                                variant="primary"
                                className="relative z-20"
                                onClick={() => handleOpenEdit(project)}
                            >
                                Edit
                            </NeonButton>
                        </div>
                    </div>
                ))}
            </div>
            {showForm && (
                <ProjectForm onClose={handleCloseCreate}/>
            )}
            {projectToEdit && (
                <ProjectEditModal
                    project={projectToEdit}
                    onClose={handleCloseEdit}
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                    errorMessage={updateError}
                />
            )}
        </section>
    );
}