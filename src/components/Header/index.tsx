import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectInitialized, selectIsAuthenticated, selectUser} from "../../features/auth/slice/authSlice.ts";
import {generateAvatar} from "../../utils/avatar";
import {useState} from "react";

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const initialized = useAppSelector(selectInitialized);

    const[isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    }



    const getUserName = ()=>{
        if (user?.nickname) {
            return user.nickname;
        }else if (user?.email) {
            return user.email;
        }
        return "No name";
    };
    return (
        <header className="w-full sticky top-0 z-50 px-6 py-6">
            <div className="mx-auto max-w-7xl relative group">
                <div className="relative z-10 flex items-center justify-between px-8 py-4 rounded-2xl border border-cyan-400/50 bg-slate-950/90 backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500 ease-in-out hover:scale-[1.05] hover:shadow-[0_10px_80px_rgba(6,182,212,0.6)] origin-center">

                    <Link to="/" className="flex items-center space-x-3">
                        <div className="relative flex items-center justify-center w-20 h-20 transition-all duration-500 hover:scale-[1.35]">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute animate-[spin_10s_linear_infinite]">
                                <circle cx="12" cy="12" r="10" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-[0_0_8px_rgba(34,211,238,1)] transition-all duration-500">
                                <circle cx="12" cy="12" r="8" stroke="#22d3ee" strokeWidth="2" />
                                <path d="M12 8V12M12 12H16M12 12V16M12 12H8" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="2" fill="white" className="animate-pulse" />
                            </svg>
                        </div>

                        <span className="text-4xl tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,1)] transition-all duration-500 hover:scale-[1.25] flex items-baseline">
                            <span className="text-white font-black tracking-wider logo-wave-text transition-all duration-500">
                                Tracker
                            </span>
                            <span className="text-cyan-400 font-black hover:text-white transition-all duration-500 ml-1">
                                App
                            </span>
                        </span>
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.35] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.35] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                        >
                            About
                        </Link>
                        <Link
                            to="/projects"
                            className="text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.35] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                        >
                            Projects
                        </Link>


                        {initialized ? (
                            isAuthenticated ? (
                                <div className="relative ml-6">
                                    <img

                                        src={
                                            user?.avatarUrl ||
                                            (user?.email ? generateAvatar(user.email) : "default-avatar-url")
                                        }
                                        alt="Profile Avatar"

                                        className="w-12 h-12 rounded-full cursor-pointer"
                                        onClick={() => setIsMenuOpen((v) => !v)}
                                    />


                                    {isMenuOpen && (
                                        <div className="absolute top-14 right-0 w-64 rounded-2xl border border-cyan-400/50 bg-slate-950/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8), 0_0_25px_rgba(6,128,212,0.35)] p-4">

                                            <div className="text-center mb-3">
                        <span className="text-sm font-bold text-cyan-400">
                          {getUserName()}
                        </span>
                                            </div>


                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    navigate("/profile");
                                                }}
                                                className="w-full text-left text-cyan-700 hover:text-cyan-500 font-semibold"
                                            >
                                                Personal account
                                            </button>


                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left mt-2 text-red-600 hover:text-red-400 font-semibold"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="ml-6 text-sm font-bold text-white hover:text-cyan-400 hover:scale-[1.35] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out"
                                    >
                                        Sign up
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="rounded-xl bg-cyan-500 border border-cyan-300/50 px-6 py-2.5 text-sm font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-[1.35] hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all duration-300 ease-in-out"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )
                        ) : (
                            <>

                                <div className="ml-6 h-12 w-12 bg-slate-950/90 rounded-full animate-pulse"></div>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}