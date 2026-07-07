import * as Yup from "yup";
import {checkAuth, login, selectLoginError} from "../slice/authSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useNavigate} from "react-router-dom";
import DynamicForm from "../../../components/ui/DynamicForm";
import type {FieldConfig} from "../../../components/ui/types";
import {EMAIL_REGEX} from "../constants/validation.ts";

type LoginFormProps = {
    emailConfirmed?: boolean;
    confirmedEmail?: string;
};

const LoginForm = ({emailConfirmed, confirmedEmail}: LoginFormProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loginError = useAppSelector(selectLoginError);

    const initialValues = {
        email: confirmedEmail || "",
        password: "",
    };

    const fields: FieldConfig[] = [
        {
            name: "email",
            label: "Email:",
            type: "text",
            placeholder: "you@example.com"
        },
        {
            name: "password",
            label: "Password:",
            type: "password",
            placeholder: "••••••••"
        },
    ];

    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Email is required!")
            .matches(EMAIL_REGEX, "Invalid email format!"),
        password: Yup.string()
            .required("Password is required!")
    });

    const handleSubmit = async (values: typeof initialValues) => {
        const dispatchResult = await dispatch(
            login({
                email: values.email.toLowerCase().trim(),
                password: values.password,
            })
        );
        if (login.fulfilled.match(dispatchResult)) {
            await dispatch(checkAuth());
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center">
            <div className="w-full max-w-lg relative">
                <DynamicForm
                    title="Sign In"
                    description={
                        emailConfirmed
                            ? "🎉 Email confirmed! Your account is now active. Please log in."
                            : "Enter your credentials to access the system"
                    }
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate("/")}
                    submitText="Login"
                    errorMessage={loginError}
                />
            </div>
        </div>
    );
};

export default LoginForm;