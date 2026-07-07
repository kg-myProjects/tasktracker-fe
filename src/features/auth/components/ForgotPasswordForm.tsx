import {useNavigate} from "react-router-dom";
import {useState} from "react";
import type {FieldConfig} from "../../../components/ui/types.ts";
import * as Yup from "yup";
import {EMAIL_REGEX} from "../constants/validation.ts";
import {fetchForgotPassword} from "../services/api.ts";
import DynamicForm from "../../../components/ui/DynamicForm.tsx";

const initialValues = {
    email: "",
};

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fields: FieldConfig[] = [
        {
            name: "email",
            label: "Email:",
            type: "email",
            placeholder: "you@example.com"
        }
    ];

    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Email is required!")
            .matches(EMAIL_REGEX, "Invalid email format!")
    });


    const handleSubmit = async (values: typeof initialValues) => {
        setError(null);
        setSuccessMessage(null);
        try {
            await fetchForgotPassword(values.email.toLowerCase().trim());
            setSuccessMessage(
                "🎉 If this email exists, a reset link has been sent!"
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center">
            <div className="w-full max-w-lg">
                <DynamicForm
                    title="Forgot Password"
                    description={successMessage || "Enter your email to receive a recovery link"}
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate("/login")}
                    submitText="Send Recovery Link"
                    errorMessage={error || undefined}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
