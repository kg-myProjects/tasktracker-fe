import {Navigate} from "react-router-dom";
import {useAppSelector} from "../app/hooks";
import {selectIsAuthenticated, selectIsInitialized} from "../features/auth/slice/authSlice";
import React from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export default function PrivateRoute({children}: PrivateRouteProps) {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsInitialized);

    if (!isInitialized) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>
        {children}
    </>;
}
