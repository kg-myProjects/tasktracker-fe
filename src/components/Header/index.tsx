import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectIsAuthenticated, selectIsInitialized, selectUser} from "../../features/auth/slice/authSlice.ts";
import MainButton from "../ui/buttons/MainButton.tsx";
import {API_URL} from "../../config/api.ts";
import MainLogo from "./MainLogo.tsx";
import {useState} from "react";
import MobileMenu from "./MobileMenu.tsx";

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
                <div className="relative flex z-10 items-center gap-6 px-8 py-4 rounded-2xl border border-cyan-400/50 bg-slate-950/90 backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500 ease-in-out hover:shadow-[0_10px_80px_rgba(6,182,212,0.6)] origin-center">
                    {/* MAIN LOGO */}
                    <Link to="/" className="flex items-center">
                        <MainLogo />
                    </Link>
                    {/* NAVIGATION */}
                    <nav className="flex items-center w-full gap-10">
                        <Link to="/about"
                            className="hidden md:block text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.20] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                        >
                            About
                        </Link>
                        {isAuthenticated && (
                            <Link to="/projects"
                                className="hidden md:block text-sm font-bold text-white whitespace-nowrap hover:text-cyan-400 hover:scale-[1.20] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] transition-all duration-300"
                            >
                                My boards
                            </Link>
                        )}
                        <div className="flex items-center justify-end gap-3 md:gap-6 ml-auto min-w-fit md:min-w-[350px] flex-shrink-0">
                            {isInitialized ? (
                                isAuthenticated ? (
                                    <>
                                        <Link to="/profile"
                                            className="flex items-center font-bold text-white hover:text-cyan-400 hover:scale-[1.20] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out">
                                            <div
                                                className="w-10 h-10 flex rounded-full bg-cyan-300 border-2 border-cyan-500 items-center justify-center text-xs text-white overflow-hidden">
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
                                        <div className="hidden md:block">
                                            <MainButton onClick={handleLogout}>
                                                Logout
                                            </MainButton>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMobileOpen(true)}
                                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-xl border-2 border-cyan-500 text-white hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:scale-[1.20] transition-all duration-300 ease-in-out">
                                            ☰
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register"
                                            className="text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.35] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                                        >
                                            Sign up
                                        </Link>
                                        <MainButton to="/login">
                                            Sign in
                                        </MainButton>
                                    </>
                                )
                            ) : (
                                <>
                                    <div className="h-10 w-20 bg-slate-950/90 rounded"></div>
                                    <div className="h-10 w-20 bg-slate-950/90 rounded"></div>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
            {/* MOBILE SCREEN MENU */}
            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
        </header>
    );
}