import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectIsAuthenticated, selectIsInitialized, selectUser} from "../../features/auth/slice/authSlice.ts";
import MainButton from "../ui/buttons/MainButton.tsx";
import {API_URL} from "../../config/api.ts";
import NavigationLink from "./NavigationLink.tsx";

type ActionsProps = {
    onOpenMobileMenu: () => void;
};

export default function Actions({onOpenMobileMenu}: ActionsProps) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isInitialized = useAppSelector(selectIsInitialized);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    };

    return (
        <>
            {isInitialized ? (
                isAuthenticated ? (
                    <>
                        {/* USER AVATAR */}
                        <Link to="/profile" className="flex items-center font-bold text-white hover:text-cyan-400 hover:scale-[1.20] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out">
                            <div className="w-12 h-12 flex rounded-full bg-cyan-300 border-2 border-cyan-500 items-center justify-center text-xs text-white overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img
                                        src={`${API_URL}${user.avatarUrl}?t=${Date.now()}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.email?.[0].toUpperCase()
                                )}
                            </div>
                        </Link>
                        {/* LOGOUT */}
                        <div className="hidden md:block">
                            <MainButton onClick={handleLogout}>
                                Logout
                            </MainButton>
                        </div>
                        {/* MOBILE MENU ICON */}
                        <button
                            type="button"
                            onClick={onOpenMobileMenu}
                            className="md:hidden w-12 h-12 flex items-center justify-center rounded-full border-2 border-cyan-500 text-white transition-all duration-300 ease-in-out hover:scale-[1.20] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                        >
                            <svg
                                className="w-5 h-5 text-white transition-all duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        {/* SIGN IN / SIGN UP */}
                        <NavigationLink to="/register">
                            Sign up
                        </NavigationLink>
                        <MainButton to="/login">
                            Sign in
                        </MainButton>
                    </>
                )
            ) : (
                <>
                    {/* PLACEHOLDERS */}
                    <div className="h-10 w-20 bg-slate-950/90"></div>
                    <div className="h-10 w-20 bg-slate-950/90"></div>
                </>
            )}
        </>
    );
}