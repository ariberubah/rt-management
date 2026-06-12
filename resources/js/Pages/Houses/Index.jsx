import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import { Link } from '@inertiajs/react';
import { Plus, Eye, Pencil, Home } from 'lucide-react';

export default function HousesIndex({ houses }) {
    return (
        <AppLayout title="Kelola Rumah">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Daftar Rumah ({houses.total})
                        </h2>
                        <Link href="/houses/create">
                            <Button size="sm">
                                <Plus size={16} />
                                Tambah Rumah
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">No. Rumah</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Alamat</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Penghuni Aktif</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {houses.data.map((house) => {
                                    const activeResident = house.house_residents?.find(r => r.is_active);
                                    return (
                                        <tr key={house.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <Home size={16} className="text-gray-400" />
                                                    {house.nomor_rumah}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{house.alamat}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={house.status === 'dihuni' ? 'success' : 'gray'}>
                                                    {house.status === 'dihuni' ? 'Dihuni' : 'Tidak Dihuni'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {activeResident?.resident?.nama_lengkap ?? '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/houses/${house.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/houses/${house.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Pencil size={14} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {houses.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                            Belum ada data rumah
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {houses.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Menampilkan {houses.from}–{houses.to} dari {houses.total} rumah
                            </p>
                            <div className="flex gap-2">
                                {houses.links.map((link, i) => (
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