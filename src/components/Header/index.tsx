import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectIsAuthenticated, selectUser} from "../../features/auth/slice/authSlice.ts";

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    }

    return (
        <header className="w-full sticky top-0 z-50 px-6 py-6">
            <div className="mx-auto max-w-7xl relative group">
                <div className="relative z-10 flex items-center justify-between px-8 py-4 rounded-2xl border border-cyan-400/50 bg-slate-950/90 backdrop-blur-2xl shadow-[0_5px_15px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500 hover:shadow-[0_8px_20px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,1)]">

                    <Link to="/" className="flex items-center space-x-3 group/logo">
                        <div className="relative flex items-center justify-center w-10 h-10">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute animate-[spin_10s_linear_infinite]">
                                <circle cx="12" cy="12" r="10" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                            </svg>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-[0_0_8px_rgba(34,211,238,1)]">
                                <circle cx="12" cy="12" r="8" stroke="#22d3ee" strokeWidth="2" />
                                <path d="M12 8V12M12 12H16M12 12V16M12 12H8" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="2" fill="white" className="animate-pulse" />
                            </svg>
                        </div>

                        <span className="text-xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(6,182,212,1)]">
                            TRACKER<span className="text-cyan-400">APP</span>
                        </span>
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link to="/" className="text-sm font-bold text-gray-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,1)] transition-all">Home</Link>
                        <Link to="/about" className="text-sm font-bold text-gray-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,1)] transition-all">About</Link>
                        <Link to="/projects" className="text-sm font-bold text-gray-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,1)] transition-all">Projects</Link>

                        <div className="flex items-center space-x-4 ml-6">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm font-bold text-cyan-400/80 italic">
                                        {user?.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-bold text-gray-400 hover:text-white transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="text-sm font-bold text-gray-400 hover:text-white transition-all">
                                        Sign up
                                    </Link>
                                    <Link to="/login" className="rounded-xl bg-cyan-500 border border-cyan-300/50 px-6 py-2.5 text-sm font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all">
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}