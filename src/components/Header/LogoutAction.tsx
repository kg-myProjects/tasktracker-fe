import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks.ts";
import {logout} from "../../features/auth/slice/authSlice.ts";
import MainButton from "../ui/buttons/MainButton.tsx";
import {memo} from "react";

type LogoutActionProps = {
    onAfterLogout?: () => void;
};

function LogoutAction({onAfterLogout}: LogoutActionProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        onAfterLogout?.();
        navigate("/login");
    };

    return (
        <MainButton onClick={handleLogout}>
            Logout
        </MainButton>
    );
}

export default memo(LogoutAction);