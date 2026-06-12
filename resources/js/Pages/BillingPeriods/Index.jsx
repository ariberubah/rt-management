import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import Select from '@/Components/ui/Select';
import { Link, useForm, router } from '@inertiajs/react';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getNamaBulan } from '@/lib/utils';

const BULAN = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: getNamaBulan(i + 1) }));
const TAHUN = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

export default function BillingPeriodsIndex({ periods }) {
    const [modal, setModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/billing-periods', {
            onSuccess: () => { setModal(false); reset(); },
        });
    }

    return (
        <AppLayout title="Kelola Tagihan">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Periode Tagihan ({periods.total})
                        </h2>
                        <Button size="sm" onClick={() => setModal(true)}>
                            <Plus size={16} />
                            Buat Periode
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Periode</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Total Tagihan</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status Generate</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {periods.data.map((period) => (
                                <tr key={period.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {getNamaBulan(period.bulan)} {period.tahun}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {period.billing_items_count} tagihan
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={period.generated_at ? 'success' : 'warning'}>
                                            {period.generated_at ? 'Sudah Generate' : 'Belum Generate'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/billing-periods/${period.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Hapus periode ini?')) {
                                                        router.delete(`/billing-periods/${period.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {periods.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                        Belum ada periode tagihan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Modal open={modal} onClose={() => setModal(false)} title="Buat Periode Tagihan">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Bulan"
                        value={data.bulan}
                        onChange={e => setData('bulan', Number(e.target.value))}
                        error={errors.bulan}
                    >
                        {BULAN.map(b => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                        ))}
                    </Select>
                    <Select
                        label="Tahun"
                        value={data.tahun}
                        onChange={e => setData('tahun', Number(e.target.value))}
                        error={errors.tahun}
                    >
                        {TAHUN.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </Select>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat Periode'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setModal(false)}>
                            Batal
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}