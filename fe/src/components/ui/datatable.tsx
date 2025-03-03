import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[]
    data: TData[]
    searchKey?: string
    page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    onSearch?: (value: string) => void
    isLoading?: boolean
    actions?: (row: TData) => React.ReactNode
}

export function DataTable<TData>({
    columns,
    data,
    searchKey,
    page = 1,
    totalPages = 1,
    onPageChange,
    onSearch,
    isLoading = false,
    actions,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4">
            {searchKey && onSearch && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder={`Search ${searchKey}...`}
                        onChange={(e) => onSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                                {actions && <TableHead>Actions</TableHead>}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1}>
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Skeleton key={i} className="h-8 w-full" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell className="space-x-2">
                                            {actions(row.original)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange?.(Math.max(1, page - 1))}
                                isActive={page === 1}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-4">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                                isActive={page === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}