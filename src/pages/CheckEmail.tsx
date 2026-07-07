import {useLocation} from "react-router-dom";
import {usePageTitle} from "../app/customHooks/usePageTitle";
import MainButton from "../components/ui/buttons/MainButton.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../app/hooks.ts";
import {selectIsAuthenticated} from "../features/auth/slice/authSlice.ts";

export default function CheckEmail() {
    usePageTitle("TrackerApp | Check email");

    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const email = location.state?.email;

    useEffect(() => {
        if (!email || isAuthenticated) {
            navigate(isAuthenticated ? "/" : "/register");
        }
    }, [email, isAuthenticated, navigate]);

    if (!email || isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-start justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="rounded-2xl border-2 border-cyan-900/50 bg-slate-950 p-8 text-center">
                    <h2 className="text-cyan-400 text-2xl font-bold mb-4">📧 Check your Email</h2>
                    <p className="text-white">We sent a confirmation link to:</p>
                    {email && (
                        <p className="text-cyan-300 font-bold mt-4">{email}</p>
                    )}
                    <p className="text-slate-400 mt-4 mb-6">Open the link in the email to activate your account.</p>
                    <MainButton to="/login">
                        Continue to login
                    </MainButton>
                </div>
            </div>
        </div>
    );
}