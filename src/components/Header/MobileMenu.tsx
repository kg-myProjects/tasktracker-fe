import NavigationLink from "./NavigationLink.tsx";
import LogoutAction from "./LogoutAction.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function MobileMenu({open, onClose}: Props) {

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
            <div
                className={`absolute right-0 top-0 h-full w-50 bg-slate-900 border-l-2 border-cyan-500/20 p-11 transform transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col gap-4">
                    <NavigationLink to="/about" onClick={onClose}>About</NavigationLink>
                    <NavigationLink to="/projects" onClick={onClose}>My boards</NavigationLink>
                    <NavigationLink to="/profile" onClick={onClose}>Profile</NavigationLink>
                    <hr className="border-cyan-500/20"/>
                    <LogoutAction onAfterLogout={onClose}/>
                </div>
            </div>
        </div>
    );
};