import {Link} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {selectIsAuthenticated, selectIsInitialized, selectUser, selectUserDefaultAvatar} from "../../features/auth/slice/authSlice.ts";
import MainButton from "../ui/buttons/MainButton.tsx";
import {API_URL} from "../../config/api.ts";
import NavigationLink from "./NavigationLink.tsx";
import {BurgerMenuIcon} from "../ui/icons/BurgerMenuIcon.tsx";
import {memo} from "react";
import LogoutAction from "./LogoutAction.tsx";

type ActionsProps = {
    onOpenMobileMenu: () => void;
};

function Actions({onOpenMobileMenu}: ActionsProps) {

    const isInitialized = useAppSelector(selectIsInitialized);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const userDefaultAvatar = useAppSelector(selectUserDefaultAvatar);

    return (
        <>
            {isInitialized ? (
                isAuthenticated ? (
                    <>
                        {/* USER AVATAR */}
                        <Link to="/profile" className="flex items-center font-semibold text-white hover:scale-[1.1] hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)] hover:text-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-in-out">
                            <div className="w-12 h-12 flex rounded-full bg-cyan-300 border-2 border-cyan-500 items-center justify-center text-xs text-white overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img
                                        src={`${API_URL}${user.avatarUrl}${user.avatarUpdatedAt ? `?t=${user.avatarUpdatedAt}` : ""}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    userDefaultAvatar
                                )}
                            </div>
                        </Link>
                        {/* LOGOUT */}
                        <div className="hidden md:block">
                            <LogoutAction/>
                        </div>
                        {/* MOBILE MENU */}
                        <button
                            type="button"
                            onClick={onOpenMobileMenu}
                            className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-surface-dark border-2 border-cyan-500 text-white transition-all duration-300 ease-in-out hover:scale-[1.2] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                        >
                            <BurgerMenuIcon className="w-5 h-5 transition-all duration-300" />
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

export default memo(Actions);