import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import { useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { useState } from 'react';

export default function HouseShow({ house, residents }) {
    const [assignModal, setAssignModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        resident_id: '',
        tanggal_masuk: '',
    });

    const activeResident = house.house_residents?.find(r => r.is_active);

    function handleAssign(e) {
        e.preventDefault();
        post(`/houses/${house.id}/assign-resident`, {
            onSuccess: () => {
                setAssignModal(false);
                reset();
            },
        });
    }

    function handleUnassign() {
        if (confirm('Keluarkan penghuni dari rumah ini?')) {
            router.post(`/houses/${house.id}/unassign-resident`);
        }
    }

    return (
        <AppLayout title={`Rumah ${house.nomor_rumah}`}>
            <div className="space-y-6 max-w-3xl">
                <Link href="/houses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={14} />
                    Kembali
                </Link>

                {/* Info Rumah */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Info Rumah</h2>
                            <Badge variant={house.status === 'dihuni' ? 'success' : 'gray'}>
                                {house.status === 'dihuni' ? 'Dihuni' : 'Tidak Dihuni'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex gap-4">
                            <span className="text-gray-500 w-32">Nomor Rumah</span>
                            <span className="font-medium">{house.nomor_rumah}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-500 w-32">Alamat</span>
                            <span>{house.alamat}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Penghuni Aktif */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Penghuni Aktif</h2>
                            <div className="flex gap-2">
                                {!activeResident && (
                                    <Button size="sm" onClick={() => setAssignModal(true)}>
                                        <UserPlus size={14} />
                                        Tambah Penghuni
                                    </Button>
                                )}
                                {activeResident && (
                                    <Button size="sm" variant="danger" onClick={handleUnassign}>
                                        <UserMinus size={14} />
                                        Keluarkan
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                        {activeResident ? (
                            <div className="space-y-2">
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-32">Nama</span>
                                    <span className="font-medium">{activeResident.resident?.nama_lengkap}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-32">No. Telepon</span>
                                    <span>{activeResident.resident?.no_telepon}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-32">Status</span>
                                    <Badge variant="info">{activeResident.resident?.status_penghuni}</Badge>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500 w-32">Tanggal Masuk</span>
                                    <span>{activeResident.tanggal_masuk}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">Tidak ada penghuni aktif</p>
                        )}
                    </CardContent>
                </Card>

                {/* Riwayat Penghuni */}
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">Riwayat Penghuni</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Nama</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Masuk</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Keluar</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {house.house_residents?.map((hr) => (
                                    <tr key={hr.id}>
                                        <td className="px-6 py-3">{hr.resident?.nama_lengkap}</td>
                                        <td className="px-6 py-3 text-gray-500">{hr.tanggal_masuk}</td>
                                        <td className="px-6 py-3 text-gray-500">{hr.tanggal_keluar ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={hr.is_active ? 'success' : 'gray'}>
                                                {hr.is_active ? 'Aktif' : 'Keluar'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Assign */}
            <Modal
                open={assignModal}
                onClose={() => setAssignModal(false)}
                title="Tambah Penghuni ke Rumah"
            >
                <form onSubmit={handleAssign} className="space-y-4">
                    <Select
                        label="Pilih Penghuni"
                        value={data.resident_id}
                        onChange={e => setData('resident_id', e.target.value)}
                        error={errors.resident_id}
                    >
                        <option value="">-- Pilih Penghuni --</option>
                        {residents.map(r => (
                            <option key={r.id} value={r.id}>{r.nama_lengkap}</option>
                        ))}
                    </Select>
                    <Input
                        label="Tanggal Masuk"
                        type="date"
                        value={data.tanggal_masuk}
                        onChange={e => setData('tanggal_masuk', e.target.value)}
                        error={errors.tanggal_masuk}
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setAssignModal(false)}>
                            Batal
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}