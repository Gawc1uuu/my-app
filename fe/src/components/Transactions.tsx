// components/Transactions.tsx
import { useEffect, useState, useMemo } from "react";
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './ui/datatable';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const PAGE_SIZE = 5;

export interface Transaction {
    transactionId: string;
    type: string;
    subType: string;
    amount: string;
    status: string;
    description: string;
    createdAt: string;
}

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        subType: '',
        status: '',
        minAmount: '',
        maxAmount: '',
        search: '',
    });

    const columns: ColumnDef<Transaction>[] = [
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'subType', header: 'Sub Type' },
        { accessorKey: 'amount', header: 'Amount' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'description', header: 'Description' },
        {
            accessorKey: 'createdAt', header: 'Date', cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleDateString()
        },
    ];

    // Memoized filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // Type filter
            if (filters.type && transaction.type !== filters.type) return false;

            // Subtype filter
            if (filters.subType && transaction.subType !== filters.subType) return false;

            // Status filter
            if (filters.status && transaction.status !== filters.status) return false;

            // Amount range filter
            const amount = parseFloat(transaction.amount);
            if (filters.minAmount && amount < parseFloat(filters.minAmount)) return false;
            if (filters.maxAmount && amount > parseFloat(filters.maxAmount)) return false;

            // Search filter
            if (filters.search &&
                !transaction.description?.toLowerCase().includes(filters.search.toLowerCase())
            ) return false;

            return true;
        });
    }, [transactions, filters]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredTransactions.slice(startIndex, endIndex);
    }, [filteredTransactions, currentPage]);

    // Total pages calculation
    const totalPages = useMemo(() => {
        return Math.ceil(filteredTransactions.length / PAGE_SIZE);
    }, [filteredTransactions]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/transactions');
            const data = await response.json();

            if (response.ok) {
                setTransactions(data);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to fetch transactions');
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Type Filter */}
                    <Select onValueChange={v => handleFilterChange('type', v === 'all' ? '' : v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sub Type Filter */}
                    <Select onValueChange={v => handleFilterChange('subType', v === 'all' ? '' : v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Sub Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="reward">Reward</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select onValueChange={v => handleFilterChange('status', v === 'all' ? '' : v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>


                    {/* Amount Range */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Min Amount"
                            type="number"
                            value={filters.minAmount}
                            onChange={e => handleFilterChange('minAmount', e.target.value)}
                        />
                        <Input
                            placeholder="Max Amount"
                            type="number"
                            value={filters.maxAmount}
                            onChange={e => handleFilterChange('maxAmount', e.target.value)}
                        />
                    </div>
                </div>

                {/* Search Input */}
                <Input
                    placeholder="Search descriptions..."
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                />
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <DataTable<Transaction>
                columns={columns}
                data={paginatedData}
                isLoading={loading}
                searchKey="description"
                onSearch={value => handleFilterChange('search', value)}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Transactions;