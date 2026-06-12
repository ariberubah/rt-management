import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function ResidentShow({ resident }) {
    return (
        <AppLayout title="Detail Penghuni">
            <div className="max-w-2xl space-y-6">
                <Link href="/residents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={14} />
                    Kembali
                </Link>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Data Penghuni</h2>
                            <Link href={`/residents/${resident.id}/edit`}>
                                <Button size="sm" variant="secondary">
                                    <Pencil size={14} />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {resident.foto_ktp_path && (
                            <div>
                                <p className="text-gray-500 mb-2">Foto KTP</p>
                                <img
                                    src={`/storage/${resident.foto_ktp_path}`}
                                    alt="Foto KTP"
                                    className="w-48 rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500">Nama Lengkap</p>
                                <p className="font-medium mt-0.5">{resident.nama_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">No. Telepon</p>
                                <p className="font-medium mt-0.5">{resident.no_telepon}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status Penghuni</p>
                                <Badge className="mt-1" variant={resident.status_penghuni === 'tetap' ? 'info' : 'warning'}>
                                    {resident.status_penghuni === 'tetap' ? 'Tetap' : 'Kontrak'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-gray-500">Status Menikah</p>
                                <Badge className="mt-1" variant={resident.status_menikah === 'menikah' ? 'success' : 'gray'}>
                                    {resident.status_menikah === 'menikah' ? 'Menikah' : 'Belum Menikah'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Riwayat Rumah */}
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">Riwayat Rumah</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">No. Rumah</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Masuk</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Keluar</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {resident.house_residents?.map((hr) => (
                                    <tr key={hr.id}>
                                        <td className="px-6 py-3 font-medium">{hr.house?.nomor_rumah}</td>
                                        <td className="px-6 py-3 text-gray-500">{hr.tanggal_masuk}</td>
                                        <td className="px-6 py-3 text-gray-500">{hr.tanggal_keluar ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={hr.is_active ? 'success' : 'gray'}>
                                                {hr.is_active ? 'Aktif' : 'Keluar'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                                {!resident.house_residents?.length && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                                            Belum ada riwayat rumah
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}