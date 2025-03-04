import { useUsersContext } from "@/hooks/useUsersContext"
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import useAuthContext from "@/hooks/useAuthContext"
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Save, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DataTable } from './ui/datatable'

export interface User {
    id: string
    email?: string
    created_at: string
    user_metadata?: {
        role?: string
    }
}

const AdminPanel = () => {
    const { user } = useAuthContext()
    const { users, loading, error, createUser, deleteUser, updateUser, refreshUsers } = useUsersContext()
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' })
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editedEmail, setEditedEmail] = useState('')
    const [editedRole, setEditedRole] = useState('user')

    // Memoize columns to prevent unnecessary re-renders
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => editingId === row.original.id ? (
                <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full"
                    autoFocus // Helps maintain focus
                />
            ) : (
                row.original.email
            )
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => editingId === row.original.id ? (
                <Select
                    value={editedRole}
                    onValueChange={setEditedRole}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            ) : (
                row.original.user_metadata?.role || 'user'
            )
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
        },
    ], [editingId, editedEmail, editedRole]) // Add dependencies here

    const handleEditClick = (user: User) => {
        setEditingId(user.id)
        setEditedEmail(user.email || '')
        setEditedRole(user.user_metadata?.role || 'user')
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditedEmail('')
        setEditedRole('user')
    }

    const handleSave = async (userId: string) => {
        try {
            await updateUser(userId, {
                email: editedEmail,
                role: editedRole
            })
            setEditingId(null)
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }

    const userActions = (row: User) => {
        const isEditing = editingId === row.id

        return isEditing ? (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() => handleSave(row.id)}
                    className="h-8"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-8"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
            </div>
        ) : (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditClick(row)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => deleteUser(row.id)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createUser(newUser.email, newUser.password, newUser.role)
        setNewUser({ email: '', password: '', role: 'user' })
    }

    useEffect(() => {
        const loadData = async () => {
            if (user?.user_metadata?.role === 'admin') {
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

                    <DataTable<User>
                        columns={columns}
                        data={users}
                        isLoading={loading}
                        actions={userActions}
                        searchKey="email"
                        onSearch={(value) => {
                            // Implement search logic here
                            console.log('Search:', value)
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminPanel