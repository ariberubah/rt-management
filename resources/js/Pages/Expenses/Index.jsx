import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah, getNamaBulan, NAMA_BULAN } from '@/lib/utils';

const TAHUN = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

export default function ExpensesIndex({ expenses, categories, bulan, tahun }) {
    const [modal, setModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        expense_category_id: '',
        nominal: '',
        deskripsi: '',
        tanggal: new Date().toISOString().split('T')[0],
        bukti: null,
    });

    function openCreate() {
        setEditTarget(null);
        reset();
        setModal(true);
    }

    function openEdit(expense) {
        setEditTarget(expense);
        setData({
            expense_category_id: expense.expense_category_id,
            nominal: expense.nominal,
            deskripsi: expense.deskripsi,
            tanggal: expense.tanggal,
            bukti: null,
        });
        setModal(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editTarget) {
            post(`/expenses/${editTarget.id}?_method=PUT`, {
                forceFormData: true,
                onSuccess: () => { setModal(false); reset(); },
            });
        } else {
            post('/expenses', {
                forceFormData: true,
                onSuccess: () => { setModal(false); reset(); },
            });
        }
    }

    function handleDelete(id) {
        if (confirm('Hapus pengeluaran ini?')) {
            router.delete(`/expenses/${id}`);
        }
    }

    const totalPengeluaran = expenses.data.reduce((sum, e) => sum + Number(e.nominal), 0);

    return (
        <AppLayout title="Kelola Pengeluaran">
            <div className="space-y-4">
                {/* Filter */}
                <Card>
                    <CardContent className="py-3">
                        <form method="GET" action="/expenses" className="flex gap-3 items-end">
                            <Select
                                label="Bulan"
                                name="bulan"
                                defaultValue={bulan}
                                className="w-36"
                            >
                                {NAMA_BULAN.map((b, i) => (
                                    <option key={i + 1} value={i + 1}>{b}</option>
                                ))}
                            </Select>
                            <Select
                                label="Tahun"
                                name="tahun"
                                defaultValue={tahun}
                                className="w-28"
                            >
                                {TAHUN.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </Select>
                            <Button type="submit" variant="secondary" size="md">
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Pengeluaran {getNamaBulan(bulan)} {tahun}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Total: {formatRupiah(totalPengeluaran)}
                                </p>
                            </div>
                            <Button size="sm" onClick={openCreate}>
                                <Plus size={16} />
                                Tambah
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tanggal</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Kategori</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Deskripsi</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Nominal</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Bukti</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {expenses.data.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-600">{expense.tanggal}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={expense.category?.is_recurring ? 'info' : 'gray'}>
                                                {expense.category?.nama_kategori}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">{expense.deskripsi}</td>
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            {formatRupiah(expense.nominal)}
                                        </td>
                                        <td className="px-6 py-3">
                                        
                                            {expense.bukti_path ? (
                                                <a
                                                    href={'/storage/' + expense.bukti_path}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    Lihat
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(expense)}
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(expense.id)}
                                                >
                                                    <Trash2 size={14} className="text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {expenses.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Belum ada pengeluaran bulan ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title={editTarget ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Kategori"
                        value={data.expense_category_id}
                        onChange={e => setData('expense_category_id', e.target.value)}
                        error={errors.expense_category_id}
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                        ))}
                    </Select>
                    <Input
                        label="Nominal"
                        type="number"
                        value={data.nominal}
                        onChange={e => setData('nominal', e.target.value)}
                        error={errors.nominal}
                        placeholder="Contoh: 500000"
                    />
                    <Input
                        label="Deskripsi"
                        value={data.deskripsi}
                        onChange={e => setData('deskripsi', e.target.value)}
                        error={errors.deskripsi}
                        placeholder="Contoh: Gaji satpam bulan Juni"
                    />
                    <Input
                        label="Tanggal"
                        type="date"
                        value={data.tanggal}
                        onChange={e => setData('tanggal', e.target.value)}
                        error={errors.tanggal}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Bukti (opsional)</label>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => setData('bukti', e.target.files[0])}
                            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
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