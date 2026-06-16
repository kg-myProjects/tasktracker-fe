import {Link} from "react-router-dom";
import MainButton from "../ui/buttons/MainButton";
import {useAppDispatch} from "../../app/hooks";
import {logout} from "../../features/auth/slice/authSlice";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function MobileMenu({open, onClose}: Props) {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await dispatch(logout());
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
            <div
                className={`absolute right-0 top-0 h-full w-50 bg-slate-900 border-2 border-cyan-500/20 p-6 transform transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col gap-6 text-white">
                    <Link to="/about" onClick={onClose}>About</Link>
                    <Link to="/projects" onClick={onClose}>My boards</Link>
                    <MainButton onClick={handleLogout}>
                        Logout
                    </MainButton>
                </div>
            </div>
        </div>
    );
}