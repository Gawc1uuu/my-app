import useAuthContext from "@/hooks/useAuthContext";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdminClient";

interface IUsersContext {
    users: any[],
    loading: boolean;
    error: string | null;
    createUser: (email: string, password: string, role?: string) => Promise<void>;
    updateUser: (id: string, updates: { email?: string; role?: string }) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    refreshUsers: () => Promise<void>
}

export const UsersContext = createContext<IUsersContext>({
    users: [],
    loading: false,
    error: null,
    createUser: async () => { },
    updateUser: async () => { },
    deleteUser: async () => { },
    refreshUsers: async () => { },
})

const UsersContextProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyAdmin = () => {
        if (!user || user?.user_metadata.role !== 'admin') {
            throw new Error('Unauthorized');
        }
    };

    const refreshUsers = async () => {
        try {
            verifyAdmin();
            setLoading(true);
            const { data, error } = await supabaseAdmin.auth.admin.listUsers();

            if (error) throw error;
            setUsers(data.users);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (email: string, password: string, role = 'user') => {
        try {
            verifyAdmin();
            setLoading(true);
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role }
            });

            if (error) throw error;
            await refreshUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, updates: { email?: string; role?: string }) => {
        try {
            verifyAdmin();
            setLoading(true);
            const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
                ...updates,
                user_metadata: updates.role ? { role: updates.role } : undefined
            });

            if (error) throw error;
            await refreshUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            verifyAdmin();
            setLoading(true);
            const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

            if (error) throw error;
            await refreshUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.user_metadata?.role === 'admin') {
            refreshUsers();
        }
    }, [user]);


    return (
        <UsersContext.Provider value={{
            users,
            loading,
            error,
            createUser,
            updateUser,
            deleteUser,
            refreshUsers
        }}>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersContextProvider