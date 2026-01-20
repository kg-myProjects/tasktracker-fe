import ProjectsList from "../features/projects/components/ProjectsList";
import ProjectForm from "../features/projects/components/ProjectForm";

export default function Projects() {
    return (
        <div className="flex gap-4 p-4">
            <div className="flex-1">
                <ProjectsList/>
            </div>

            <div className="w-1/2">
                <ProjectForm/>
            </div>
        </div>
    );
}
