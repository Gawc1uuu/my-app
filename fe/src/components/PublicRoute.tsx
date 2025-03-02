import useAuthContext from "@/hooks/useAuthContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user } = useAuthContext()
    if (user) {
        return <Navigate to="/" replace />
    }
    return (
        <>{children}</>
    )
}

export default PublicRoute