import LoginForm from "../features/auth/components/LoginForm";
import {useLocation} from "react-router-dom";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function Login() {
    usePageTitle("TrackerApp | Sign In")

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const confirmed = params.get("confirmed") === "true";
    const email = params.get("email") ?? "";

    return (
        <LoginForm
            emailConfirmed={confirmed}
            confirmedEmail={email}
        />
    );
}