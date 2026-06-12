<?php

namespace App\Http\Controllers;

use App\Models\BillingItem;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'billing_item_id' => 'required|exists:billing_items,id',
            'jumlah_bayar' => 'required|numeric|min:1',
            'tanggal_bayar' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        Payment::create($request->all());

        BillingItem::find($request->billing_item_id)
            ->update(['status' => 'lunas']);

        return redirect()->back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function destroy(Payment $payment)
    {
        $payment->billingItem->update(['status' => 'belum_lunas']);
        $payment->delete();

        return redirect()->back()->with('success', 'Pembayaran berhasil dihapus.');
    }
    public function storeAnnual(Request $request)
    {
        $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'tahun' => 'required|integer',
            'tanggal_bayar' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        // Ambil semua billing item kebersihan untuk rumah ini dalam 1 tahun
        $items = BillingItem::whereHas(
            'billingPeriod',
            fn($q) =>
            $q->where('tahun', $request->tahun)
        )
            ->where('house_id', $request->house_id)
            ->where('jenis_iuran', 'kebersihan')
            ->where('status', 'belum_lunas')
            ->get();

        if ($items->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada tagihan kebersihan yang belum lunas untuk tahun ini.');
        }

        foreach ($items as $item) {
            Payment::create([
                'billing_item_id' => $item->id,
                'jumlah_bayar' => $item->nominal,
                'tanggal_bayar' => $request->tanggal_bayar,
                'keterangan' => $request->keterangan ?? 'Bayar tahunan',
            ]);
            $item->update(['status' => 'lunas']);
        }

        return redirect()->back()->with('success', 'Pembayaran kebersihan 1 tahun berhasil dicatat.');
    }
}