import useAuthContext from "@/hooks/useAuthContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const { user } = useAuthContext()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <>{children}/</>
    )
}

export default ProtectedRoute