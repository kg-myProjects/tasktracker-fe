import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectIsAuthenticated, selectIsInitialized, selectUser} from "../../features/auth/slice/authSlice.ts";
import MainButton from "../ui/buttons/MainButton.tsx";
import {API_URL} from "../../config/api.ts";
import MainLogo from "./MainLogo.tsx";
import {useState} from "react";
import MobileMenu from "./MobileMenu.tsx";
import NavigationLink from "./NavigationLink.tsx";

export default function Header() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isInitialized = useAppSelector(selectIsInitialized);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    }

    return (
        <header className="w-full sticky top-0 z-50 px-2 py-6">
            <div className="mx-auto max-w-7xl relative">

                <div className="relative flex z-10 items-center px-4 py-4 rounded-2xl border-2 border-cyan-900/50 bg-slate-950/90 backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500 ease-in-out hover:shadow-[0_10px_80px_rgba(6,182,212,0.6)]">
                    {/* LEFT BLOCK */}
                    <div className="flex items-center">
                        {/* MAIN LOGO */}
                        <Link to="/" className="flex items-center">
                            <MainLogo/>
                        </Link>
                        {/* NAVIGATION */}
                        <nav className="flex pl-10 gap-10">
                            <NavigationLink to="/about" className="hidden md:block">
                                About
                            </NavigationLink>
                            {isAuthenticated && (
                                <NavigationLink to="/projects" className="hidden md:block">
                                    My boards
                                </NavigationLink>
                            )}
                        </nav>
                    </div>
                    {/* RIGHT BLOCK */}
                    <div className="flex items-center justify-end gap-3 md:gap-6 ml-auto flex-shrink-0">
                        {isInitialized ? (
                            isAuthenticated ? (
                                <>
                                    <Link to="/profile" className="flex items-center font-bold text-white hover:text-cyan-400 hover:scale-[1.20] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out">
                                        {/* USER AVATAR */}
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
                                        <button type="button" onClick={() => setMobileOpen(true)}
                                            className="md:hidden w-12 h-12 flex items-center justify-center rounded-full border-2 border-cyan-500 text-white transition-all duration-300 ease-in-out hover:scale-[1.20] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                                        >
                                            <svg className="w-5 h-5 text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
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
                        </div>
                </div>
            </div>
            {/* MOBILE MENU */}
            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)}/>
        </header>
    );
}