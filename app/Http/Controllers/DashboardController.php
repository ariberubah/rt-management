<?php

namespace App\Http\Controllers;

use App\Models\BillingItem;
use App\Models\Expense;
use App\Models\House;
use App\Models\Resident;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tahun = request('tahun', now()->year);

        $pemasukanPerBulan = BillingItem::where('status', 'lunas')
            ->whereHas('billingPeriod', fn($q) => $q->where('tahun', $tahun))
            ->with('billingPeriod')
            ->get()
            ->groupBy('billingPeriod.bulan')
            ->map(fn($items) => $items->sum('nominal'));

        $pengeluaranPerBulan = Expense::where('tahun', $tahun)
            ->get()
            ->groupBy('bulan')
            ->map(fn($items) => $items->sum('nominal'));

        $bulan = collect(range(1, 12))->mapWithKeys(fn($b) => [
            $b => [
                'pemasukan' => $pemasukanPerBulan[$b] ?? 0,
                'pengeluaran' => $pengeluaranPerBulan[$b] ?? 0,
            ]
        ]);

        return Inertia::render('Dashboard/Index', [
            'summary' => $bulan,
            'tahun' => $tahun,
            'stats' => [
                'total_rumah' => House::count(),
                'rumah_dihuni' => House::where('status', 'dihuni')->count(),
                'total_penghuni' => Resident::count(),
                'belum_lunas' => BillingItem::where('status', 'belum_lunas')->count(),
            ],
        ]);
    }
}