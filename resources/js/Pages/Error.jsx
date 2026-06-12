import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

export default function Error({ status }) {
    const messages = {
        404: { title: 'Halaman Tidak Ditemukan', desc: 'Halaman yang Anda cari tidak ada.' },
        403: { title: 'Akses Ditolak', desc: 'Anda tidak punya izin untuk mengakses halaman ini.' },
        500: { title: 'Server Error', desc: 'Terjadi kesalahan di server.' },
    };

    const { title, desc } = messages[status] ?? { title: 'Error', desc: 'Terjadi kesalahan.' };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <AlertTriangle size={48} className="text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">{status}</h1>
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <p className="text-gray-500">{desc}</p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
}