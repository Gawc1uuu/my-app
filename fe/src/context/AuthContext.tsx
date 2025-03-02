import { createContext, ReactNode, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface IAuthContext {
    user: any;
    login: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>
    logout: () => Promise<void>

}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    login: async () => { },
    signUp: async () => { },
    logout: async () => { },
})


const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {

        supabase.auth.getSession().then(({ data }) => {
            return setUser(data?.session?.user ?? null)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })


        return () => {
            listener.subscription.unsubscribe()
        }

    }, [])


    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        })

        return { data, error }
    }

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider