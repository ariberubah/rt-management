import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import Input from '@/Components/ui/Input';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ExpenseCategoriesIndex({ categories }) {
    const [modal, setModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_kategori: '',
        is_recurring: false,
    });

    function openCreate() {
        setEditTarget(null);
        reset();
        setModal(true);
    }

    function openEdit(category) {
        setEditTarget(category);
        setData({
            nama_kategori: category.nama_kategori,
            is_recurring: category.is_recurring,
        });
        setModal(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editTarget) {
            put(`/expense-categories/${editTarget.id}`, {
                onSuccess: () => { setModal(false); reset(); },
            });
        } else {
            post('/expense-categories', {
                onSuccess: () => { setModal(false); reset(); },
            });
        }
    }

    function handleDelete(id) {
        if (confirm('Hapus kategori ini?')) {
            router.delete(`/expense-categories/${id}`);
        }
    }

    return (
        <AppLayout title="Kategori Pengeluaran">
            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Daftar Kategori ({categories.length})
                            </h2>
                            <Button size="sm" onClick={openCreate}>
                                <Plus size={16} />
                                Tambah Kategori
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Nama Kategori</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tipe</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Jml Pengeluaran</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            {category.nama_kategori}
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={category.is_recurring ? 'info' : 'gray'}>
                                                {category.is_recurring ? 'Rutin' : 'Tidak Rutin'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {category.expenses_count} pengeluaran
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(category)}
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 size={14} className="text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                            Belum ada kategori
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
                title={editTarget ? 'Edit Kategori' : 'Tambah Kategori'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Kategori"
                        value={data.nama_kategori}
                        onChange={e => setData('nama_kategori', e.target.value)}
                        error={errors.nama_kategori}
                        placeholder="Contoh: Gaji Satpam"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_recurring"
                            checked={data.is_recurring}
                            onChange={e => setData('is_recurring', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="is_recurring" className="text-sm text-gray-700">
                            Pengeluaran Rutin (muncul tiap bulan)
                        </label>
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