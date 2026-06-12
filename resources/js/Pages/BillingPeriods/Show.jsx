import AppLayout from "@/Components/Layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/Components/ui/Card";
import Button from "@/Components/ui/Button";
import Badge from "@/Components/ui/Badge";
import Modal from "@/Components/ui/Modal";
import Input from "@/Components/ui/Input";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Zap, CreditCard } from "lucide-react";
import { useState } from "react";
import { getNamaBulan, formatRupiah } from "@/lib/utils";

export default function BillingPeriodShow({ period }) {
    const [payModal, setPayModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        billing_item_id: "",
        jumlah_bayar: "",
        tanggal_bayar: new Date().toISOString().split("T")[0],
        keterangan: "",
    });

    function openPayModal(item) {
        setSelectedItem(item);
        setData({
            billing_item_id: item.id,
            jumlah_bayar: item.nominal,
            tanggal_bayar: new Date().toISOString().split("T")[0],
            keterangan: "",
        });
        setPayModal(true);
    }

    function handlePay(e) {
        e.preventDefault();
        post("/payments", {
            onSuccess: () => {
                setPayModal(false);
                reset();
            },
        });
    }

    function handleGenerate() {
        if (confirm("Generate tagihan untuk semua rumah yang dihuni?")) {
            router.post(`/billing-periods/${period.id}/generate`);
        }
    }

    const lunas =
        period.billing_items?.filter((i) => i.status === "lunas").length ?? 0;
    const total = period.billing_items?.length ?? 0;
    const [annualModal, setAnnualModal] = useState(false);
    const {
        data: annualData,
        setData: setAnnualData,
        post: postAnnual,
        processing: annualProcessing,
        reset: resetAnnual,
    } = useForm({
        house_id: "",
        resident_id: "",
        tahun: period.tahun,
        tanggal_bayar: new Date().toISOString().split("T")[0],
        keterangan: "",
    });

    function handleAnnual(e) {
        e.preventDefault();
        postAnnual("/payments/annual", {
            onSuccess: () => {
                setAnnualModal(false);
                resetAnnual();
            },
        });
    }

    return (
        <AppLayout
            title={`Tagihan ${getNamaBulan(period.bulan)} ${period.tahun}`}
        >
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                    <Link
                        href="/billing-periods"
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft size={14} />
                        Kembali
                    </Link>
                    {!period.generated_at && (
                        <Button onClick={handleGenerate}>
                            <Zap size={16} />
                            Generate Tagihan
                        </Button>
                    )}
                    <div className="flex gap-2">
                        {!period.generated_at && (
                            <Button onClick={handleGenerate}>
                                <Zap size={16} />
                                Generate Tagihan
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={() => setAnnualModal(true)}
                        >
                            <CreditCard size={16} />
                            Bayar Kebersihan Tahunan
                        </Button>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="py-4">
                            <p className="text-xs text-gray-500">
                                Total Tagihan
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {total}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="py-4">
                            <p className="text-xs text-gray-500">Sudah Lunas</p>
                            <p className="text-2xl font-bold text-green-600">
                                {lunas}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="py-4">
                            <p className="text-xs text-gray-500">Belum Lunas</p>
                            <p className="text-2xl font-bold text-red-500">
                                {total - lunas}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Tagihan */}
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Detail Tagihan
                        </h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Rumah
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Penghuni
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Jenis
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Nominal
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {period.billing_items?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3 font-medium">
                                            {item.house?.nomor_rumah}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {item.resident?.nama_lengkap}
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge
                                                variant={
                                                    item.jenis_iuran ===
                                                    "satpam"
                                                        ? "info"
                                                        : "warning"
                                                }
                                            >
                                                {item.jenis_iuran === "satpam"
                                                    ? "Satpam"
                                                    : "Kebersihan"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {formatRupiah(item.nominal)}
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge
                                                variant={
                                                    item.status === "lunas"
                                                        ? "success"
                                                        : "danger"
                                                }
                                            >
                                                {item.status === "lunas"
                                                    ? "Lunas"
                                                    : "Belum Lunas"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            {item.status === "belum_lunas" && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        openPayModal(item)
                                                    }
                                                >
                                                    <CreditCard size={14} />
                                                    Bayar
                                                </Button>
                                            )}
                                            {item.status === "lunas" && (
                                                <span className="text-xs text-gray-400">
                                                    {
                                                        item.payment
                                                            ?.tanggal_bayar
                                                    }
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!period.billing_items?.length && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
                                            Belum ada tagihan — klik Generate
                                            Tagihan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Bayar */}
            <Modal
                open={payModal}
                onClose={() => setPayModal(false)}
                title="Catat Pembayaran"
            >
                <form onSubmit={handlePay} className="space-y-4">
                    {selectedItem && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                            <p>
                                <span className="text-gray-500">Rumah:</span>{" "}
                                <span className="font-medium">
                                    {selectedItem.house?.nomor_rumah}
                                </span>
                            </p>
                            <p>
                                <span className="text-gray-500">Penghuni:</span>{" "}
                                <span className="font-medium">
                                    {selectedItem.resident?.nama_lengkap}
                                </span>
                            </p>
                            <p>
                                <span className="text-gray-500">Jenis:</span>{" "}
                                <span className="font-medium capitalize">
                                    {selectedItem.jenis_iuran}
                                </span>
                            </p>
                        </div>
                    )}
                    <Input
                        label="Jumlah Bayar"
                        type="number"
                        value={data.jumlah_bayar}
                        onChange={(e) =>
                            setData("jumlah_bayar", e.target.value)
                        }
                        error={errors.jumlah_bayar}
                    />
                    <Input
                        label="Tanggal Bayar"
                        type="date"
                        value={data.tanggal_bayar}
                        onChange={(e) =>
                            setData("tanggal_bayar", e.target.value)
                        }
                        error={errors.tanggal_bayar}
                    />
                    <Input
                        label="Keterangan (opsional)"
                        value={data.keterangan}
                        onChange={(e) => setData("keterangan", e.target.value)}
                        placeholder="Contoh: Bayar 3 bulan sekaligus"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Catat Pembayaran"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setPayModal(false)}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                open={annualModal}
                onClose={() => setAnnualModal(false)}
                title="Bayar Kebersihan 1 Tahun"
            >
                <form onSubmit={handleAnnual} className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                        Akan melunasi semua tagihan kebersihan yang belum lunas
                        untuk rumah dan tahun yang dipilih.
                    </div>
                    <Select
                        label="Rumah"
                        value={annualData.house_id}
                        onChange={(e) => {
                            const house = period.billing_items?.find(
                                (i) => i.house_id == e.target.value,
                            );
                            setAnnualData({
                                ...annualData,
                                house_id: e.target.value,
                                resident_id: house?.resident_id ?? "",
                            });
                        }}
                    >
                        <option value="">-- Pilih Rumah --</option>
                        {[
                            ...new Map(
                                period.billing_items?.map((i) => [
                                    i.house_id,
                                    i,
                                ]),
                            ).values(),
                        ].map((item) => (
                            <option key={item.house_id} value={item.house_id}>
                                {item.house?.nomor_rumah}
                            </option>
                        ))}
                    </Select>
                    <Input
                        label="Tanggal Bayar"
                        type="date"
                        value={annualData.tanggal_bayar}
                        onChange={(e) =>
                            setAnnualData("tanggal_bayar", e.target.value)
                        }
                    />
                    <Input
                        label="Keterangan (opsional)"
                        value={annualData.keterangan}
                        onChange={(e) =>
                            setAnnualData("keterangan", e.target.value)
                        }
                        placeholder="Contoh: Bayar kebersihan 2025"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={annualProcessing}>
                            {annualProcessing
                                ? "Menyimpan..."
                                : "Bayar Sekarang"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setAnnualModal(false)}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
