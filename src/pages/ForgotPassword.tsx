import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import {usePageTitle} from "../app/customHooks/usePageTitle";

export default function ForgotPassword() {
    usePageTitle("TrackerApp | Forgot Password");
    return <ForgotPasswordForm />;
}