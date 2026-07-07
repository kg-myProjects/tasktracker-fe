import {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import axiosInstance from "../../../lib/axiosInstance.ts";
import {fetchResetPassword} from "../services/api";
import DynamicForm from "../../../components/ui/DynamicForm";
import type {FieldConfig} from "../../../components/ui/types";
import {PASSWORD_REQUIREMENTS} from "../constants/validation.ts";

const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
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
            label: "New Password:",
            type: "password",
            placeholder: "••••••••",
            helperText: (value) => (
                <div className="space-y-1 text-sm">
                    {PASSWORD_REQUIREMENTS.map((req) => {
                        const passed = req.regex.test(value);
                        return (
                            <div
                                key={req.message}
                                className={passed ? "text-green-400" : "text-cyan-400/60"}
                            >
                                {passed ? "✓" : "○"} {req.message}
                            </div>
                        );
                    })}
                </div>
            )
        },
        {
            name: "confirmNewPassword",
            label: "Confirm New Password:",
            type: "password",
            placeholder: "••••••••"
        }
    ];

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .required("Password is required!")
            .test(
                "password-rules",
                "Password requirements are not met",
                (value) =>
                    PASSWORD_REQUIREMENTS.every(req => req.regex.test(value ?? ""))
            ),
        confirmNewPassword: Yup.string()
            .required("Confirmation is required!")
            .oneOf([Yup.ref("newPassword")], "Passwords must match!")
    });

    useEffect(() => {
        if (!token) {
            setError("Password reset token is missing!");
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
                setError("Reset link is invalid or expired!");
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
            setError("Failed to reset password!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-cyan-400 font-black uppercase tracking-widest animate-pulse">
                Checking reset link...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center">
            <div className="w-full max-w-lg">
                <DynamicForm
                    title="Reset Password"
                    description={success
                        ? "✅ Password updated! Redirecting to login..."
                        : "Choose a new password"
                    }
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate("/login")}
                    submitText="Set New Password"
                    errorMessage={error || undefined}
                />
            </div>
        </div>
    );
};

export default ResetPasswordForm;
