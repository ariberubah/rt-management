import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ResidentForm({ resident }) {
    const isEdit = !!resident;

    const { data, setData, post, put, processing, errors } = useForm({
        nama_lengkap: resident?.nama_lengkap ?? '',
        no_telepon: resident?.no_telepon ?? '',
        status_penghuni: resident?.status_penghuni ?? 'tetap',
        status_menikah: resident?.status_menikah ?? 'belum_menikah',
        foto_ktp: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            post(`/residents/${resident.id}?_method=PUT`, {
                forceFormData: true,
            });
        } else {
            post('/residents', { forceFormData: true });
        }
    }

    return (
        <AppLayout title={isEdit ? 'Edit Penghuni' : 'Tambah Penghuni'}>
            <div className="max-w-lg">
                <Link href="/residents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={14} />
                    Kembali
                </Link>
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">
                            {isEdit ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nama Lengkap"
                                value={data.nama_lengkap}
                                onChange={e => setData('nama_lengkap', e.target.value)}
                                error={errors.nama_lengkap}
                                placeholder="Masukkan nama lengkap"
                            />
                            <Input
                                label="Nomor Telepon"
                                value={data.no_telepon}
                                onChange={e => setData('no_telepon', e.target.value)}
                                error={errors.no_telepon}
                                placeholder="Contoh: 08123456789"
                            />
                            <Select
                                label="Status Penghuni"
                                value={data.status_penghuni}
                                onChange={e => setData('status_penghuni', e.target.value)}
                                error={errors.status_penghuni}
                            >
                                <option value="tetap">Tetap</option>
                                <option value="kontrak">Kontrak</option>
                            </Select>
                            <Select
                                label="Status Menikah"
                                value={data.status_menikah}
                                onChange={e => setData('status_menikah', e.target.value)}
                                error={errors.status_menikah}
                            >
                                <option value="belum_menikah">Belum Menikah</option>
                                <option value="menikah">Menikah</option>
                            </Select>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Foto KTP
                                </label>
                                {isEdit && resident.foto_ktp_path && (
                                    <img
                                        src={`/storage/${resident.foto_ktp_path}`}
                                        alt="Foto KTP"
                                        className="w-40 rounded border border-gray-200 mb-2"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setData('foto_ktp', e.target.files[0])}
                                    className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                {errors.foto_ktp && (
                                    <p className="text-xs text-red-500">{errors.foto_ktp}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/residents">
                                    <Button type="button" variant="secondary">Batal</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}