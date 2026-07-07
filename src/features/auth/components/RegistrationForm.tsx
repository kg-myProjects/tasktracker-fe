import * as Yup from "yup";
import {register, selectRegisterError} from "../slice/authSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useNavigate} from "react-router-dom";
import DynamicForm from "../../../components/ui/DynamicForm";
import type {FieldConfig} from "../../../components/ui/types";
import {EMAIL_REGEX, PASSWORD_REQUIREMENTS} from "../constants/validation";

const RegistrationForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const authError = useAppSelector(selectRegisterError);

    const initialValues = {
        email: "",
        password: "",
        confirmPassword: "",
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
            placeholder: "••••••••",
            helperText: (value) => (
                <div className="space-y-1 text-sm">
                    {PASSWORD_REQUIREMENTS.map((req) => {
                        const passed = req.regex.test(value);
                        return (
                            <div key={req.message} className={passed ? "text-green-400" : "text-cyan-400/60"}>
                                {passed ? "✓" : "○"} {req.message}
                            </div>
                        );
                    })}
                </div>
            )
        },
        {
            name: "confirmPassword",
            label: "Confirm Password:",
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
            .test("password-rules", "Password requirements are not met!", (value) =>
                PASSWORD_REQUIREMENTS.every(req => req.regex.test(value ?? ""))
            ),
        confirmPassword: Yup.string()
            .required("Confirmation is required!")
            .oneOf([Yup.ref("password")], "Passwords must match!")
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const result = await dispatch(
                register({
                    email: values.email.toLowerCase().trim(),
                    password: values.password,
                })
            ).unwrap();

            navigate("/check-email", {
                state: {
                    email: result.email,
                },
            });

        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center">
            <div className="w-full max-w-lg">
                <DynamicForm
                    title="Sign Up"
                    description="Enter your email and password to register"
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate("/")}
                    submitText="Register Now"
                    errorMessage={authError}
                />
            </div>
        </div>
    );
};

export default RegistrationForm;
