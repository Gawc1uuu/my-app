import { useUsersContext } from "@/hooks/useUsersContext"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import useAuthContext from "@/hooks/useAuthContext"

const AdminPanel = () => {
    const { user } = useAuthContext()
    const { users, loading, error, createUser, deleteUser, refreshUsers } = useUsersContext()
    console.log(users)
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createUser(newUser.email, newUser.password, newUser.role)
        setNewUser({ email: '', password: '', role: 'user' })
    }

    useEffect(() => {
        const loadData = async () => {
            if (user?.user_metadata.role === 'admin') {
                try {
                    await refreshUsers()
                } catch (error) {
                    console.error('Error loading users:', error)
                }
            }
        }
        loadData()
    }, [])

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <Button type="submit" disabled={loading}>
                            Create User
                        </Button>
                    </form>

                    {error && <p className="text-red-500">{error}</p>}
                    {users.length === 0 && (
                        <div>No users found</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminPanel