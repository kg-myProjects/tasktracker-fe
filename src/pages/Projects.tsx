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
                        className="w-full h-[180px] rounded-2xl border-2 border-dashed border-cyan-500/30 flex flex-col gap-2 uppercase tracking-[0.2em] font-black"
            >
                <span className="text-3xl font-light opacity-50">+</span>
                <span>New Project</span>
            </NeonButton>
               )}
            {showForm && (
                    <ProjectForm onClose={() => setShowForm(false)}/>
            )}
           </div>
        </div>
    );
}
