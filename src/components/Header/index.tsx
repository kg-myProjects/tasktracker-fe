import {Link} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {selectIsAuthenticated} from "../../features/auth/slice/authSlice.ts";
import MainLogo from "./MainLogo.tsx";
import {useCallback, useState} from "react";
import MobileMenu from "./MobileMenu.tsx";
import NavigationLink from "./NavigationLink.tsx";
import Actions from "./Actions.tsx";

export default function Header() {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [mobileOpen, setMobileOpen] = useState(false);

    const openMobileMenu = useCallback(() => {
        setMobileOpen(true);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setMobileOpen(false);
    }, []);

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
                        <Actions onOpenMobileMenu={openMobileMenu}/>
                    </div>
                </div>
            </div>
            {/* MOBILE MENU */}
            <MobileMenu open={mobileOpen} onClose={closeMobileMenu}/>
        </header>
    );
}