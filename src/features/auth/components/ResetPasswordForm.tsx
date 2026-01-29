import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axiosInstance from "../../../lib/axiosInstance.ts";
import { fetchResetPassword } from "../services/api";
import DynamicForm from "../../../components/ui/DynamicForm";
import type { FieldConfig } from "../../../components/ui/types";

const initialValues = {
    newPassword: "",
    confirmPassword: "",
};

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fields: FieldConfig[] = [
        {
            name: "newPassword",
            label: "New Password",
            type: "password",
            placeholder: "••••••••"
        },
        {
            name: "confirmPassword",
            label: "Confirm New Password",
            type: "password",
            placeholder: "••••••••"
        }
    ];

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Required"),
    });

    useEffect(() => {
        if (!token) {
            setError("Reset token is missing");
            setLoading(false);
            return;
        }

        const validateToken = async () => {
            try {
                await axiosInstance.get("/auth/reset-password/validate", {
                    params: { token },
                });
                setLoading(false);
            } catch {
                setError("Reset link is invalid or expired");
                setLoading(false);
            }
        };

        void validateToken();
    }, [token]);

    const handleSubmit = async (values: typeof initialValues) => {
        setError(null);
        try {
            await fetchResetPassword({
                token: token!,
                newPassword: values.newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch {
            setError("Failed to reset password");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400 font-black uppercase tracking-widest animate-pulse">
                Checking reset link...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md">
                <DynamicForm
                    title="Reset Password"
                    description={success
                        ? "✅ Password updated! Redirecting to login..."
                        : "Enter your new secret sequence"
                    }
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate("/login")}
                    submitText="Update Password"
                    errorMessage={error || undefined}
                />
            </div>
        </div>
    );
};

export default ResetPasswordForm;
