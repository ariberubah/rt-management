import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import { formatRupiah, getNamaBulan } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Home, Users, CreditCard, AlertCircle } from 'lucide-react';

export default function Dashboard({ summary, tahun, stats }) {
    const chartData = Object.entries(summary).map(([bulan, data]) => ({
        bulan: getNamaBulan(Number(bulan)).slice(0, 3),
        Pemasukan: data.pemasukan,
        Pengeluaran: data.pengeluaran,
    }));

    const statCards = [
        { label: 'Total Rumah', value: stats.total_rumah, icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Rumah Dihuni', value: stats.rumah_dihuni, icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Penghuni', value: stats.total_penghuni, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Belum Lunas', value: stats.belum_lunas, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                        <Card key={label}>
                            <CardContent className="flex items-center gap-4 py-5">
                                <div className={`rounded-xl p-3 ${bg}`}>
                                    <Icon size={20} className={color} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Pemasukan & Pengeluaran {tahun}
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value) => formatRupiah(value)}
                                    labelStyle={{ fontWeight: 600 }}
                                />
                                <Legend />
                                <Bar dataKey="Pemasukan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Pengeluaran" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}