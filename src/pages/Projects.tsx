import ProjectsList from "../features/projects/components/ProjectsList";
import ProjectForm from "../features/projects/components/ProjectForm";
import {useState} from "react";
import NeonButton from "../components/ui/NeonButton.tsx";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function Projects() {
    usePageTitle("TrackerApp | Projects");
    const [showForm, setShowForm] = useState<boolean>(false);
    return (
        <div className="flex gap-6 p-6">

            <div className="flex-1">
                <ProjectsList/>
            </div>

           <div className="w-[420px]">
               {!showForm && (
            <NeonButton size="lg"
                        variant="primary"
                        onClick={() => setShowForm(true)}
                        className="w-full">
                New Project
            </NeonButton>
               )}
            {showForm && (
                    <ProjectForm onClose={() => setShowForm(false)}/>
            )}
           </div>
        </div>
    );
}
