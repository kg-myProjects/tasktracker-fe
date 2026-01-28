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
            <h2 className="text-cyan-300 text-2xl font-bold">List of Projects</h2>
            <ul>
                {projects?.map((project, index) => (
                    <li key={project.id ?? index}>
                        <Link to={`/project/${project.id}`} className="text-cyan-400 hover:underline text-lg font-bold">
                            <h3>{project.title}</h3>
                        </Link>
                        <span>{project.description}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
