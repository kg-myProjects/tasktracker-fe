import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllProjects, selectProjects } from "../slice/projectsSlice";

export default function ProjectsList() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllProjects());
    }, [dispatch]);
    const projects = useAppSelector(selectProjects);
    return (
        <section>
            <h2>List of Projects</h2>
            <ul>
                {projects?.map((project, index) => (
                    <li key={project.id ?? index}>
                        <Link to={`/project/${project.id}`} className="text-blue-600 hover:underline">
                            <h3>{project.title}</h3>
                        </Link>
                        <span>{project.description}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
