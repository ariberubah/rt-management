import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import { Link, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

export default function ResidentsIndex({ residents }) {
    function handleDelete(id) {
        if (confirm('Hapus penghuni ini?')) {
            router.delete(`/residents/${id}`);
        }
    }

    return (
        <AppLayout title="Kelola Penghuni">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Daftar Penghuni ({residents.total})
                        </h2>
                        <Link href="/residents/create">
                            <Button size="sm">
                                <Plus size={16} />
                                Tambah Penghuni
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Nama</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">No. Telepon</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status Penghuni</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status Menikah</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rumah</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {residents.data.map((resident) => {
                                    const activeHouse = resident.house_residents?.find(r => r.is_active);
                                    return (
                                        <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {resident.nama_lengkap}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {resident.no_telepon}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={resident.status_penghuni === 'tetap' ? 'info' : 'warning'}>
                                                    {resident.status_penghuni === 'tetap' ? 'Tetap' : 'Kontrak'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={resident.status_menikah === 'menikah' ? 'success' : 'gray'}>
                                                    {resident.status_menikah === 'menikah' ? 'Menikah' : 'Belum Menikah'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {activeHouse?.house?.nomor_rumah ?? '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/residents/${resident.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/residents/${resident.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Pencil size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(resident.id)}
                                                    >
                                                        <Trash2 size={14} className="text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {residents.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Belum ada data penghuni
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {residents.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Menampilkan {residents.from}–{residents.to} dari {residents.total} penghuni
                            </p>
                            <div className="flex gap-2">
                                {residents.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1 rounded text-xs ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } ${!link.url && 'opacity-40 pointer-events-none'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}