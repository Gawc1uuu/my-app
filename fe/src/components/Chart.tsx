// components/RevenueCharts.tsx
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueData {
    subType: string;
    total: number;
}

interface ChartProps {
    transactions: {
        subType: string;
        amount: string;
        createdAt: string;
    }[];
}

const RevenueCharts = ({ transactions }: ChartProps) => {
    // Helper function to aggregate data
    const aggregateData = (transactions: any[]): RevenueData[] => {
        const grouped = transactions.reduce((acc, transaction) => {
            const amount = parseFloat(transaction.amount);
            acc[transaction.subType] = (acc[transaction.subType] || 0) + amount;
            return acc;
        }, {});

        return Object.entries(grouped).map(([subType, total]) => ({
            subType,
            total: Number(total)
        }));
    };

    // Get current month data (March 2025)
    const thisMonthData = useMemo(() => {
        const startOfMonth = new Date('2025-03-01');
        const endOfMonth = new Date('2025-03-31');

        return aggregateData(transactions.filter(t => {
            const date = new Date(t.createdAt);
            return date >= startOfMonth && date <= endOfMonth;
        }));
    }, [transactions]);

    // Get current week data (Week of March 4-10, 2025)
    const thisWeekData = useMemo(() => {
        const startOfWeek = new Date('2025-03-03'); // Monday
        const endOfWeek = new Date('2025-03-09');   // Sunday

        return aggregateData(transactions.filter(t => {
            const date = new Date(t.createdAt);
            return date >= startOfWeek && date <= endOfWeek;
        }));
    }, [transactions]);

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">March 2025 Revenue</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={thisMonthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subType" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar
                                dataKey="total"
                                name="Revenue"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Week of March 4-10, 2025</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={thisWeekData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subType" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar
                                dataKey="total"
                                name="Revenue"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueCharts;