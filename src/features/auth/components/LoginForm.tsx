import * as Yup from "yup";
import { checkAuth, login, selectLoginError } from "../slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../../components/ui/DynamicForm";
import type { FieldConfig } from "../../../components/ui/types";

type LoginFormProps = {
    emailConfirmed?: boolean;
};

const LoginForm = ({ emailConfirmed }: LoginFormProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loginError = useAppSelector(selectLoginError);

    const initialValues = {
        email: "",
        password: "",
    };

    const fields: FieldConfig[] = [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com"
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••"
        },
    ];

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        const dispatchResult = await dispatch(login(values));
        if (login.fulfilled.match(dispatchResult)) {
            await dispatch(checkAuth());
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-transparent p-4">
            <div className="w-full max-w-md relative">
                <DynamicForm
                    title="Sign In"
                    description={emailConfirmed
                        ? "🎉 Email confirmed! Please log in."
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
