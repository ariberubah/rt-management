import AppLayout from '@/Components/Layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function HouseForm({ house }) {
    const isEdit = !!house;

    const { data, setData, post, put, processing, errors } = useForm({
        nomor_rumah: house?.nomor_rumah ?? '',
        alamat: house?.alamat ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(`/houses/${house.id}`);
        } else {
            post('/houses');
        }
    }

    return (
        <AppLayout title={isEdit ? 'Edit Rumah' : 'Tambah Rumah'}>
            <div className="max-w-lg">
                <Link href="/houses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={14} />
                    Kembali
                </Link>
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">
                            {isEdit ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nomor Rumah"
                                value={data.nomor_rumah}
                                onChange={e => setData('nomor_rumah', e.target.value)}
                                error={errors.nomor_rumah}
                                placeholder="Contoh: A-01"
                            />
                            <Input
                                label="Alamat"
                                value={data.alamat}
                                onChange={e => setData('alamat', e.target.value)}
                                error={errors.alamat}
                                placeholder="Contoh: Jl. Mawar No. 1"
                            />
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/houses">
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