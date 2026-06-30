import {Navigate, Outlet} from "react-router-dom";
import {useAppSelector} from "../hooks.ts";
import {selectIsAuthenticated, selectIsInitialized} from "../../features/auth/slice/authSlice.ts";

export default function PrivateRoute() {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsInitialized);

    if (!isInitialized) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
}