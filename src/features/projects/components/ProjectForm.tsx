import * as Yup from "yup";
import DynamicForm from "../../../components/ui/DynamicForm";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {
    createProject,
    selectCreateProjectErrorMessage,
} from "../slice/projectsSlice";
import {useState} from "react";
import {usePageTitle} from "../../../app/customHooks/usePageTitle.ts";
import {selectUser} from "../../auth/slice/authSlice";
import {Link} from "react-router-dom";
import NeonButton from "../../../components/ui/buttons/NeonButton.tsx";
import {
    PROJECT_DESC_MAX,
    PROJECT_DESC_MIN,
    PROJECT_TITLE_MAX,
    PROJECT_TITLE_MIN,
    PROJECT_TITLE_REGEX
} from "../constants/projectValidation.ts";

type ProjectFormProps = {
    onClose: () => void;
};

const ProjectForm = ({onClose}: ProjectFormProps) => {
    usePageTitle("TrackerApp | New Board");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const projectError = useAppSelector(selectCreateProjectErrorMessage);
    const currentUser = useAppSelector(selectUser);

    const handleSubmit = async (values: { title: string; description: string }) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            await dispatch(createProject(values)).unwrap();

            onClose();
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setIsSubmitting(false);
        }

    };
    if (!currentUser) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div
                    className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-8 shadow-[0_0_50px_rgba(244,63,94,0.1)] text-center">
                    <div className="mb-4 flex justify-center text-rose-500">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                             className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                        </svg>
                    </div>

                    <h2 className="mb-2 text-2xl font-black text-rose-500 ">
                        Access Denied
                    </h2>

                    <p className="mb-8 text-slate-400 text-sm">
                        Authorization required to create project
                    </p>

                    <div className="flex flex-col gap-4">

                        <Link to="/login" className="w-full">
                            <NeonButton variant="primary" className="w-full border-white text-white">
                                Login
                            </NeonButton>
                        </Link>

                        <div onClick={onClose}>
                            <NeonButton variant="primary" className="w-full border-rose-500 text-rose-500">
                                Cancel
                            </NeonButton>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md">
                <DynamicForm
                    title="New Board"
                    description="Provide board title and description"
                    initialValues={{title: "", description: ""}}
                    validationSchema={Yup.object({
                        title: Yup.string()
                            .required("Title is required")
                            .min(PROJECT_TITLE_MIN, `Minimum ${PROJECT_TITLE_MIN} characters`)
                            .max(PROJECT_TITLE_MAX, `Maximum ${PROJECT_TITLE_MAX} characters`)
                            .matches(
                                PROJECT_TITLE_REGEX,
                                "Board title must be 3–50 characters and start with a letter."
                            ),
                        description: Yup.string()
                            .required("Description is required")
                            .min(PROJECT_DESC_MIN, `Minimum ${PROJECT_DESC_MIN} characters`)
                            .max(PROJECT_DESC_MAX, `Maximum ${PROJECT_DESC_MAX} characters`),
                    })}
                    fields={[
                        {name: "title", label: "Title", placeholder: "Example: Development Board"},
                        {
                            name: "description",
                            label: "Description",
                            type: "textarea",
                            placeholder: "Example: Tasks and workflow for developing a company website",
                            rows: 4
                        },
                    ]}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    onClose={onClose}
                    submitText="Create Board"
                    errorMessage={projectError || undefined}
                />
            </div>
        </div>
    );
};

export default ProjectForm;

