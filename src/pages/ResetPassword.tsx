import ResetPasswordForm from "../features/auth/components/ResetPasswordForm.tsx";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function ResetPassword() {
    usePageTitle("TrackerApp | Reset Password");
    return <ResetPasswordForm/>;
}