import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchForgotPassword } from "../features/auth/services/api.ts";
import DynamicForm from "../components/ui/DynamicForm";
import type { FieldConfig } from "../components/ui/types";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

const initialValues = {
    email: "",
};

const ForgotPasswordPage = () => {
    usePageTitle("TrackerApp | Password recovery");
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fields: FieldConfig[] = [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com"
        }
    ];

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
    });


    const handleSubmit = async (values: typeof initialValues) => {
        setError(null);
        setSuccessMessage(null);
        try {
            await fetchForgotPassword(values.email);
            setSuccessMessage(
                "🎉 If this email exists, a reset link has been sent!"
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md">
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

export default ForgotPasswordPage;
