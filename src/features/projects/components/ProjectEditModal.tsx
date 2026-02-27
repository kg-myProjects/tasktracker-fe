import { createPortal } from "react-dom";
import * as Yup from "yup";
import DynamicForm from "../../../components/ui/DynamicForm";
import type {EditProjectDto} from "../types";

type ProjectEditModalProps = {
    project: EditProjectDto;
    onClose: () => void;
    onSubmit: (values: { title: string; description: string }) => void;
    isLoading?: boolean;
    errorMessage?: string;
};

const NAME_REGEX = /^[A-Z][a-zA-Z0-9 ]{2,49}$/;

const validationSchema = Yup.object({
    title: Yup.string()
        .required("Title is required")
        .matches(
            NAME_REGEX,
            "Project title should be at least 3 to 50   characters long and start with a capital letter. Special characters cannot be used"
        ),
    description: Yup.string()
        .required("Description is required"),
});

export default function ProjectEditModal({
                                             project,
                                             onClose,
                                             onSubmit,
                                             isLoading,
                                             errorMessage,
                                         }: ProjectEditModalProps) {
    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
            <DynamicForm
                title="Edit Project"
                description="Update project details"
                fields={[
                    {
                        name: "title",
                        label: "Project Title",
                        placeholder: "Enter project title",
                    },
                    {
                        name: "description",
                        label: "Project Description",
                        type: "textarea",
                        placeholder: "Enter project description",
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
        </div>,
        document.body
    );
}