import * as Yup from "yup";
import DynamicForm from "../../../components/ui/DynamicForm";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {
    createProject,
    selectCreateProjectErrorMessage,
} from "../slice/projectsSlice";

type ProjectFormProps = {
    onClose: () => void;
};

const NAME_REGEX = /^[A-Z][a-zA-Z0-9 ]{2,49}$/;

const ProjectForm = ({ onClose }: ProjectFormProps) => {
    const dispatch = useAppDispatch();
    const projectError = useAppSelector(selectCreateProjectErrorMessage);

    const handleSubmit = async (values: { title: string; description: string }) => {
        try {
            await dispatch(createProject(values)).unwrap();

            onClose();
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    return (
        <DynamicForm
            title="New Project"
            description="Enter the project title and description"
            initialValues={{ title: "", description: "" }}
            validationSchema={Yup.object({
                title: Yup.string()
                    .required("Title is required")
                    .matches(
                        NAME_REGEX,
                        "Project title should be at least 3 characters long and start with a capital letter. Special characters cannot be used"
                    ),
                description: Yup.string().required("Description is required"),
            })}
            fields={[
                { name: "title", label: "Title", placeholder: "New Website Development" },
                { name: "description", label: "Description", type: "textarea", placeholder: "A Project to develop a new company website", rows: 4 },
            ]}
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText="Create Project"
            errorMessage={projectError || undefined}
        />
    );
};

export default ProjectForm;

