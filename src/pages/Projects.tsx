import ProjectsList from "../features/projects/components/ProjectsList";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function Projects() {
    usePageTitle("TrackerApp | Projects");
    return <ProjectsList/>;
}