import {createPortal} from "react-dom";
import * as Yup from "yup";
import DynamicForm from "../../../components/ui/DynamicForm";
import type {EditProjectDto} from "../types";
import {
    PROJECT_DESC_MAX,
    PROJECT_DESC_MIN,
    PROJECT_TITLE_MAX,
    PROJECT_TITLE_MIN,
    PROJECT_TITLE_REGEX
} from "../constants/projectValidation.ts";
import {usePageTitle} from "../../../app/customHooks/usePageTitle.ts";

type ProjectEditModalProps = {
    project: EditProjectDto;
    onClose: () => void;
    onSubmit: (values: { title: string; description: string }) => void;
    isLoading?: boolean;
    errorMessage?: string;
};

const validationSchema = Yup.object({
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
});

export default function ProjectEditModal({
                                             project,
                                             onClose,
                                             onSubmit,
                                             isLoading,
                                             errorMessage,
                                         }: ProjectEditModalProps) {
    usePageTitle("TrackerApp | Edit Board");
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md">
                <DynamicForm
                    title="Edit Board"
                    description="Update board title and description"
                    fields={[
                        {
                            name: "title",
                            label: "Board Title",
                            placeholder: "Enter board title",
                        },
                        {
                            name: "description",
                            label: "Board Description",
                            type: "textarea",
                            placeholder: "Enter board description",
                            rows: 4,
                        },
                    ]}
                    initialValues={{
                        title: project.title,
                        description: project.description,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    onClose={onClose}
                    submitText="Save Changes"
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                />
            </div>
        </div>,
        document.body
    );
}