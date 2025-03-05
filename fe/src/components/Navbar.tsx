import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import useAuthContext from "@/hooks/useAuthContext"

export function Navbar() {

    const { user } = useAuthContext()
    const { logout } = useAuthContext()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return (
        <nav className="flex items-center justify-between w-full border-b p-4">
            <div className="font-bold text-xl">
                <Link to="/">MyLogo</Link>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    {user && user.role === 'admin' && (
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link to="/users">Users</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {user && (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/transactions">Transactions</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Button onClick={handleLogout}>Logout</Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    )}
                    {!user && (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/login">Login</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/signup">Sign up</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
}
