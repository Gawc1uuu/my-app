import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"

const useAuthContext = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('You have to use AuthContext inside a provider')
    }
    return ctx;
}

export default useAuthContext