import { UsersContext } from "@/context/UsersContext";
import { useContext } from "react";

export const useUsersContext = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};