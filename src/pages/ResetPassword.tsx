import ResetPasswordForm from "../features/auth/components/ResetPasswordForm.tsx";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

const ResetPassword = () => {
    usePageTitle("TrackerApp | Password reset");
    return <ResetPasswordForm />;
};

export default ResetPassword;